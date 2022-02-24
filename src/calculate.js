import parse from 'css-tree/parser';
import Specificity from './type/Specificity.js';
import { highest } from './filter.js';

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
                switch (child.name) {
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
                        // Calculate Specificity from nested SelectorList
                        // @note Manually parsing subtree when the child is of the type Raw, due to https://github.com/csstree/csstree/issues/151
                        const highest1 = highest(calculate(child.children.first.type == 'Raw' ? parse(child.children.first.value, { context: 'selectorList' }) : child.children.first));

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
                            const highest2 = highest(calculate(child.children.first.selector));

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

const convertSelectorToSelectorListObject = (selectorOrAST) => {
    // The passed in argument was a String.
    // ~> Let's try and parse to an AST
    if (typeof selectorOrAST === 'string' || selectorOrAST instanceof String) {
        try {
            return parse(selectorOrAST, {
                context: 'selectorList',
            });
        } catch (e) {
            throw new TypeError(`Could not convert passed in selector to SelectorList: ${e.message}`);
        }
    }

    // The passed in argument was an Object.
    // ~> Let's verify if it's a SelectorList
    if (selectorOrAST instanceof Object) {
        if (!selectorOrAST.type || selectorOrAST.type !== 'SelectorList') {
            throw new TypeError(`Passed in selector is an Object but no SelectorList`);
        }

        return selectorOrAST;
    }

    throw new TypeError(`Passed in selector is not a String nor an Object. I don't know what to do with it`);
};

const calculate = (selector) => {
    // Make sure we have a SelectorList Object
    // If not, an exception will be thrown
    const ast = convertSelectorToSelectorListObject(selector);

    // Calculate Specificity for each contained Selector
    const specificities = [];
    ast.children.forEach((selector) => {
        const specificity = calculateSpecificityOfSelectorObject(selector);
        specificities.push(specificity);
    });

    // Here ya go!
    return specificities;
};

export default calculate;
