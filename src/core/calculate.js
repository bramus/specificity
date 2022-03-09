import parse from 'css-tree/selector-parser';
import { Specificity } from './../type/index.js';
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
                        const max1 = max(calculate(child.children.first.type == 'Raw' ? parse(child.children.first.value, { context: 'selectorList' }) : child.children.first));

                        // Adjust orig specificity
                        specificity.a += max1.a;
                        specificity.b += max1.b;
                        specificity.c += max1.c;

                        break;

                    // “The specificity of an :nth-child() or :nth-last-child() selector is the specificity of the pseudo class itself (counting as one pseudo-class selector) plus the specificity of the most specific complex selector in its selector list argument”
                    case 'nth-child':
                    case 'nth-last-child':
                        specificity.b += 1;

                        if (child.children.first.selector) {
                            // Calculate Specificity from SelectorList
                            const max2 = max(calculate(child.children.first.selector));

                            // Adjust orig specificity
                            specificity.a += max2.a;
                            specificity.b += max2.b;
                            specificity.c += max2.c;
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

const convertToAST = (source, type) => {
    const typesToContextMap = {
        SelectorList: 'selectorList',
        Selector: 'selector',
    };

    // We won't support the passed in type
    if (!typesToContextMap[type]) {
        throw new TypeError(`Invalid value for argument type: ${type} is not supported.`);
    }

    // The passed in argument was a String.
    // ~> Let's try and parse to an AST
    if (typeof source === 'string' || source instanceof String) {
        try {
            return parse(source, {
                context: typesToContextMap[typesToContextMap],
            });
        } catch (e) {
            throw new TypeError(`Could not convert passed in source to ${type}: ${e.message}`);
        }
    }

    // The passed in argument was an Object.
    // ~> Let's verify if it's a AST of the type ${type}
    if (source instanceof Object) {
        if (source.type && source.type === type) {
            return source;
        }

        throw new TypeError(`Passed in source is an Object but no AST / AST of the type ${type}`);
    }

    throw new TypeError(`Passed in source is not a String nor an Object. I don't know what to do with it.`);
};

const calculate = (selector) => {
    // Make sure we have a SelectorList AST
    // If not, an exception will be thrown
    const ast = convertToAST(selector, 'SelectorList');

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
