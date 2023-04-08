import parse from 'css-tree/selector-parser';
import Specificity from '../index.js';
import { max } from './../util/index.js';

const calculateSpecificityOfSelectorObject = (selectorObj) => {
    // https://www.w3.org/TR/selectors-4/#specificity-rules
    const specificity = {
        a: 0 /* ID Selectors */,
        b: 0 /* Class selectors, Attributes selectors, and Pseudo-classes */,
        c: 0 /* Type selectors and Pseudo-elements */,
    };

    selectorObj.children.forEach((child) => {
        switch (child.type) {
            case 'IdSelector':
                specificity.a += 1;
                break;

            case 'AttributeSelector':
            case 'ClassSelector':
                specificity.b += 1;
                break;

            case 'PseudoClassSelector':
                switch (child.name.toLowerCase()) {
                    // “The specificity of a :where() pseudo-class is replaced by zero.”
                    case 'where':
                        // Noop :)
                        break;

                    // “The specificity of an :is(), :not(), or :has() pseudo-class is replaced by the specificity of the most specific complex selector in its selector list argument.“
                    case 'is':
                    case 'matches':
                    case '-webkit-any':
                    case '-moz-any':
                    case 'any':
                    case 'not':
                    case 'has':
                        if (child.children) {
                            // Calculate Specificity from nested SelectorList
                            const max1 = max(...calculate(child.children.first));

                            // Adjust orig specificity
                            specificity.a += max1.a;
                            specificity.b += max1.b;
                            specificity.c += max1.c;
                        }

                        break;

                    // “The specificity of an :nth-child() or :nth-last-child() selector is the specificity of the pseudo class itself (counting as one pseudo-class selector) plus the specificity of the most specific complex selector in its selector list argument”
                    case 'nth-child':
                    case 'nth-last-child':
                        specificity.b += 1;

                        if (child.children.first.selector) {
                            // Calculate Specificity from SelectorList
                            const max2 = max(...calculate(child.children.first.selector));

                            // Adjust orig specificity
                            specificity.a += max2.a;
                            specificity.b += max2.b;
                            specificity.c += max2.c;
                        }
                        break;

                    // “The specificity of :host is that of a pseudo-class. The specificity of :host() is that of a pseudo-class, plus the specificity of its argument.”
                    // “The specificity of :host-context() is that of a pseudo-class, plus the specificity of its argument.”
                    case 'host-context':
                    case 'host':
                        specificity.b += 1;

                        if (child.children) {
                            // Workaround to a css-tree bug in which it allows complex selectors instead of only compound selectors
                            // We work around it by filtering out any Combinator and successive Selectors
                            const childAST = { type: 'Selector', children: [] };
                            let foundCombinator = false;
                            child.children.first.children.forEach((entry) => {
                                if (foundCombinator) return false;
                                if (entry.type === 'Combinator') {
                                    foundCombinator = true;
                                    return false;
                                }
                                childAST.children.push(entry);
                            });

                            // Calculate Specificity from Selector
                            const childSpecificity = calculate(childAST)[0];

                            // Adjust orig specificity
                            specificity.a += childSpecificity.a;
                            specificity.b += childSpecificity.b;
                            specificity.c += childSpecificity.c;
                        }
                        break;

                    // Improper use of Pseudo-Class Selectors instead of a Pseudo-Element
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
                switch (child.name) {
                    // “The specificity of ::slotted() is that of a pseudo-element, plus the specificity of its argument.”
                    case 'slotted':
                        specificity.c += 1;

                        if (child.children) {
                            // Workaround to a css-tree bug in which it allows complex selectors instead of only compound selectors
                            // We work around it by filtering out any Combinator and successive Selectors
                            const childAST = { type: 'Selector', children: [] };
                            let foundCombinator = false;
                            child.children.first.children.forEach((entry) => {
                                if (foundCombinator) return false;
                                if (entry.type === 'Combinator') {
                                    foundCombinator = true;
                                    return false;
                                }
                                childAST.children.push(entry);
                            });

                            // Calculate Specificity from Selector
                            const childSpecificity = calculate(childAST)[0];

                            // Adjust orig specificity
                            specificity.a += childSpecificity.a;
                            specificity.b += childSpecificity.b;
                            specificity.c += childSpecificity.c;
                        }
                        break;

                    case 'view-transition-group':
                    case 'view-transition-image-pair':
                    case 'view-transition-old':
                    case 'view-transition-new':
                        // The specificity of a view-transition selector with a * argument is zero.
                        if (child.children && child.children.first.value === '*') {
                            break;
                        }
                        // The specificity of a view-transition selector with an argument is the same
                        // as for other pseudo - elements, and is equivalent to a type selector.
                        specificity.c += 1;
                        break;

                    default:
                        specificity.c += 1;
                        break;
                }
                break;

            case 'TypeSelector':
                // Omit namespace
                let typeSelector = child.name;
                if (typeSelector.includes('|')) {
                    typeSelector = typeSelector.split('|')[1];
                }

                // “Ignore the universal selector”
                if (typeSelector !== '*') {
                    specificity.c += 1;
                }
                break;

            default:
                // NOOP
                break;
        }
    });

    return new Specificity(specificity, selectorObj);
};

const convertToAST = (source) => {
    // The passed in argument was a String.
    // ~> Let's try and parse to an AST
    if (typeof source === 'string' || source instanceof String) {
        try {
            return parse(source, {
                context: 'selectorList',
            });
        } catch (e) {
            throw new TypeError(`Could not convert passed in source '${source}' to SelectorList: ${e.message}`);
        }
    }

    // The passed in argument was an Object.
    // ~> Let's verify if it's a AST of the type Selector or SelectorList
    if (source instanceof Object) {
        if (source.type && ['Selector', 'SelectorList'].includes(source.type)) {
            return source;
        }

        // Manually parsing subtree when the child is of the type Raw, most likely due to https://github.com/csstree/csstree/issues/151
        if (source.type && source.type === 'Raw') {
            try {
                return parse(source.value, {
                    context: 'selectorList',
                });
            } catch (e) {
                throw new TypeError(`Could not convert passed in source to SelectorList: ${e.message}`);
            }
        }

        throw new TypeError(`Passed in source is an Object but no AST / AST of the type Selector or SelectorList`);
    }

    throw new TypeError(`Passed in source is not a String nor an Object. I don't know what to do with it.`);
};

const calculate = (selector) => {
    // Quit while you're ahead
    if (!selector) {
        return [];
    }

    // Make sure we have a SelectorList AST
    // If not, an exception will be thrown
    const ast = convertToAST(selector);

    // Selector?
    if (ast.type === 'Selector') {
        return [calculateSpecificityOfSelectorObject(selector)];
    }

    // SelectorList?
    // ~> Calculate Specificity for each contained Selector
    if (ast.type === 'SelectorList') {
        const specificities = [];
        ast.children.forEach((selector) => {
            const specificity = calculateSpecificityOfSelectorObject(selector);
            specificities.push(specificity);
        });
        return specificities;
    }
};

export { calculate };
