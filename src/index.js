import * as csstree from 'css-tree';

if (!process.argv[2]) {
    console.error('Missing selector as argument');
}

// parse CSS to AST
const ast = csstree.parse(process.argv[2], {
    context: "selectorList",
});

const calcHighestSpecificityInSelectorList = (selectorList) => {
    
    // Calc specificity for each child Selector
    selectorList.children.forEach((selector) => {
        selector.specificity = calc(selector);
    });

    // Filter out the highest specificity
    const highestSpecificity = selectorList.children.reduce((currentHighestSpecificity, currentSelector) => {
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
    }, { a: 0, b: 0, c: 0 });

    return highestSpecificity;
}

const calc = (selector, level = 1) => {

    // https://www.w3.org/TR/selectors-4/#specificity-rules
    const specificity = {
        a: 0, /* ID Selectors */
        b: 0, /* Class selectors, Attributes selectors, and Pseudo-classes */
        c: 0, /* Type selectors and Pseudo-elements */
    }

    selector.children.forEach((child) => {

        switch (child.type) {
            case 'IdSelector':
                specificity.a += 1;
                break;
    
            case 'AttributeSelector':
            case 'ClassSelector':
                specificity.b +=1;
                break;

            case 'PseudoClassSelector':
                switch (child.name) {
                    // “The specificity of a :where() pseudo-class is replaced by zero.”
                    case 'where':
                        // Noop :)
                        break;
    
                    // “The specificity of an :is(), :not(), or :has() pseudo-class is replaced by the specificity of the most specific complex selector in its selector list argument.“
                    case 'is':
                    case 'not':
                    case 'has':

                        // Calculate Specificity from SelectorList
                        // Apparently this is Raw sometimes (unlike with nth-child below)
                        const highest1 = calculateHighestSpecificityInSelectorList(
                            child.children.first.type == 'Raw' ? csstree.parse(child.children.first.value, { context: 'selectorList' }) : child.children.first
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
                            const highest2 = calcHighestSpecificityInSelectorList(child.children.first.selector);
                        
                            // Adjust orig specificity
                            specificity.a += highest2.a;
                            specificity.b += highest2.b;
                            specificity.c += highest2.c;
                        }
                        break;
                }
                break;
    
            case 'TypeSelector':
                // “Ignore the universal selector”
                if (child.name !== '*') {
                    specificity.c += 1;
                }
                break;
    
            case 'Combinator':
                // Ignore
                break;
            default:
                // console.log(child);
        }
    });
    return specificity;
}

ast.children.forEach((selector) => {
    const specificity = calc(selector);
    // console.log(`Specificity for selector “${csstree.generate(selector)}” is (${specificity.a},${specificity.b},${specificity.c})`);
    console.log(`(${specificity.a},${specificity.b},${specificity.c})`);
});