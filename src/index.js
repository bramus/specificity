import csstreeParse from 'css-tree/parser';

const calculateHighestSpecificityInSelectorList = (selectorList) => {
    // Calc specificity for each child Selector
    selectorList.children.forEach((selector) => {
        selector.specificity = calculateSpecificityOfParsedSelector(selector);
    });

    // Filter out the highest specificity
    const highestSpecificity = selectorList.children.reduce(
        (currentHighestSpecificity, currentSelector) => {
            if (currentSelector.specificity.a > currentHighestSpecificity.a) {
                return currentSelector.specificity;
            }
            if (currentSelector.specificity.a < currentHighestSpecificity.a) {
                return currentHighestSpecificity;
            }

            if (currentSelector.specificity.b > currentHighestSpecificity.b) {
                return currentSelector.specificity;
            }
            if (currentSelector.specificity.b < currentHighestSpecificity.b) {
                return currentHighestSpecificity;
            }

            if (currentSelector.specificity.c > currentHighestSpecificity.c) {
                return currentSelector.specificity;
            }
            if (currentSelector.specificity.c < currentHighestSpecificity.c) {
                return currentHighestSpecificity;
            }

            // It's a tie!
            return currentHighestSpecificity;
        },
        { a: 0, b: 0, c: 0 }
    );

    return highestSpecificity;
};

const calculateSpecificityOfParsedSelector = (selector) => {
    // https://www.w3.org/TR/selectors-4/#specificity-rules
    const specificity = {
        a: 0 /* ID Selectors */,
        b: 0 /* Class selectors, Attributes selectors, and Pseudo-classes */,
        c: 0 /* Type selectors and Pseudo-elements */,
    };

    selector.children.forEach((child) => {
        switch (child.type) {
            case 'IdSelector':
                specificity.a += 1;
                break;

            case 'AttributeSelector':
            case 'ClassSelector':
                specificity.b += 1;
                break;

            case 'PseudoClassSelector':
                switch (child.name) {
                    // “The specificity of a :where() pseudo-class is replaced by zero.”
                    case 'where':
                        // Noop :)
                        break;

                    // “The specificity of an :is(), :not(), or :has() pseudo-class is replaced by the specificity of the most specific complex selector in its selector list argument.“
                    case 'is':
                    case "matches":
                    case "-webkit-any":
                    case "-moz-any":
                    case "any":
                    case 'not':
                    case 'has':
                        // Calculate Specificity from SelectorList
                        // Apparently this is Raw sometimes (unlike with nth-child below)
                        const highest1 = calculateHighestSpecificityInSelectorList(
                            child.children.first.type == 'Raw' ? csstreeParse(child.children.first.value, { context: 'selectorList' }) : child.children.first
                        );

                        // Adjust orig specificity
                        specificity.a += highest1.a;
                        specificity.b += highest1.b;
                        specificity.c += highest1.c;

                        break;

                    // “The specificity of an :nth-child() or :nth-last-child() selector is the specificity of the pseudo class itself (counting as one pseudo-class selector) plus the specificity of the most specific complex selector in its selector list argument”
                    case 'nth-child':
                    case 'nth-last-child':
                        specificity.b += 1;

                        if (child.children.first.selector) {
                            // Calculate Specificity from SelectorList
                            const highest2 = calculateHighestSpecificityInSelectorList(child.children.first.selector);

                            // Adjust orig specificity
                            specificity.a += highest2.a;
                            specificity.b += highest2.b;
                            specificity.c += highest2.c;
                        }
                        break;

                    // Improper use of Pseudo-Element Selectors
                    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements#index
                    case 'after':
                    case 'before':
                    case 'first-letter':
                    case 'first-line':
                        specificity.c += 1;
                        break;

                    default:
                        specificity.b += 1;
                        break;
                }
                break;

            case 'PseudoElementSelector':
                specificity.c += 1;
                break;

            case 'TypeSelector':
                // “Ignore the universal selector”
                if (child.name !== '*') {
                    specificity.c += 1;
                }
                break;

            default:
                // NOOP
                break;
        }
    });
    return specificity;
};

const calculate = (selector) => {
    const ast = csstreeParse(selector, {
        context: 'selectorList',
    });

    if (ast.children.size > 1) {
        throw new TypeError('Please pass in only 1 Selector');
    }

    return calculateSpecificityOfParsedSelector(ast.children.first);
};

export { calculate };
