import parse from 'css-tree/selector-parser';
import Specificity from '../index.js';
import { calculateForSelector } from './calculate-generic.js';
import { csstreeWalker } from './adapters/csstree.js';

/** @param {import('css-tree').Selector} selectorAST */
const calculateForAST = (selectorAST) => {
    // Quit while you're ahead
    if (!selectorAST || selectorAST.type !== 'Selector') {
        throw new TypeError(`Passed in source is not a Selector AST`);
    }

    const { a, b, c } = calculateForSelector(selectorAST, csstreeWalker);
    return new Specificity({ a, b, c }, selectorAST);
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

/**
 * @param {string} selector
 * @returns {Specificity[]}
 */
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
        return [calculateForAST(selector)];
    }

    // SelectorList?
    // ~> Calculate Specificity for each contained Selector
    if (ast.type === 'SelectorList') {
        const specificities = [];
        ast.children.forEach((childAST) => {
            const specificity = calculateForAST(childAST);
            specificities.push(specificity);
        });
        return specificities;
    }
};

export { calculate, calculateForAST };
