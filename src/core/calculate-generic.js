/**
 * @typedef {'id' | 'class' | 'attribute' | 'type' | 'universal' | 'pseudo-class' | 'pseudo-element' | 'combinator' | 'other'} SimpleNodeType
 */

/**
 * @typedef {Object} SelectorWalker
 * @property {(node: any) => SimpleNodeType} getType
 * @property {(node: any) => string} getName
 * @property {(node: any) => Iterable<any>} getChildren
 * @property {(node: any) => Iterable<any> | null} getSelectorListArgument
 * @property {(node: any) => string | null} [getViewTransitionArgument]
 */

// Pseudo-classes whose specificity = max specificity of their selector list argument
const FORGIVING_PSEUDO_CLASSES = new Set(['-moz-any', 'is', 'matches', 'not', 'has']);

// Legacy pseudo-element syntax written as pseudo-class (:before instead of ::before)
const LEGACY_PSEUDO_ELEMENTS = new Set(['after', 'before', 'first-letter', 'first-line']);

const VIEW_TRANSITION_PSEUDO_ELEMENTS = new Set(['view-transition-group', 'view-transition-image-pair', 'view-transition-old', 'view-transition-new']);

/**
 * Calculate specificity for a single Selector node using the provided walker.
 *
 * @param {any} selectorNode - A Selector AST node
 * @param {SelectorWalker} walker
 * @returns {{ a: number, b: number, c: number }}
 */
const calculateForSelector = (selectorNode, walker) => {
    let a = 0;
    let b = 0;
    let c = 0;

    for (const child of walker.getChildren(selectorNode)) {
        const type = walker.getType(child);

        switch (type) {
            case 'id':
                a += 1;
                break;

            case 'class':
            case 'attribute':
                b += 1;
                break;

            case 'pseudo-class': {
                const name = walker.getName(child).toLowerCase();

                if (name === 'where') {
                    // :where() specificity is zero
                    break;
                }

                if (name === '-webkit-any' || name === 'any') {
                    const selectorList = walker.getSelectorListArgument(child);
                    if (selectorList) {
                        b += 1;
                    }
                    break;
                }

                if (FORGIVING_PSEUDO_CLASSES.has(name)) {
                    // Specificity = max specificity of selector list argument
                    const selectorList = walker.getSelectorListArgument(child);
                    if (selectorList) {
                        const maxSpec = maxSpecificity(selectorList, walker);
                        a += maxSpec.a;
                        b += maxSpec.b;
                        c += maxSpec.c;
                    }
                    break;
                }

                if (name === 'nth-child' || name === 'nth-last-child') {
                    // Counts as a pseudo-class
                    b += 1;

                    // Plus the max specificity of the `of` selector list, if present
                    const selectorList = walker.getSelectorListArgument(child);
                    if (selectorList) {
                        const maxSpec = maxSpecificity(selectorList, walker);
                        a += maxSpec.a;
                        b += maxSpec.b;
                        c += maxSpec.c;
                    }
                    break;
                }

                if (name === 'host' || name === 'host-context') {
                    // Counts as a pseudo-class
                    b += 1;

                    // Plus the specificity of its compound selector argument
                    const selectorList = walker.getSelectorListArgument(child);
                    if (selectorList) {
                        const maxSpec = maxSpecificity(selectorList, walker);
                        a += maxSpec.a;
                        b += maxSpec.b;
                        c += maxSpec.c;
                    }
                    break;
                }

                if (LEGACY_PSEUDO_ELEMENTS.has(name)) {
                    // :before, :after, etc. written with single colon
                    c += 1;
                    break;
                }

                // Default pseudo-class
                b += 1;
                break;
            }

            case 'pseudo-element': {
                const name = walker.getName(child).toLowerCase();

                if (name === 'slotted') {
                    c += 1;

                    // Plus the specificity of its compound selector argument
                    const selectorList = walker.getSelectorListArgument(child);
                    if (selectorList) {
                        const maxSpec = maxSpecificity(selectorList, walker);
                        a += maxSpec.a;
                        b += maxSpec.b;
                        c += maxSpec.c;
                    }
                    break;
                }

                if (VIEW_TRANSITION_PSEUDO_ELEMENTS.has(name)) {
                    // Zero specificity if argument is *
                    const vtArg = walker.getViewTransitionArgument?.(child);
                    if (vtArg === '*') {
                        break;
                    }
                    c += 1;
                    break;
                }

                // Default pseudo-element
                c += 1;
                break;
            }

            case 'type':
                c += 1;
                break;

            case 'universal':
            case 'combinator':
            case 'other':
            default:
                // No specificity contribution
                break;
        }
    }

    return { a, b, c };
};

/**
 * Find the maximum specificity among an iterable of Selector nodes.
 *
 * @param {Iterable<any>} selectors
 * @param {SelectorWalker} walker
 * @returns {{ a: number, b: number, c: number }}
 */
const maxSpecificity = (selectors, walker) => {
    let maxA = 0;
    let maxB = 0;
    let maxC = 0;

    for (const selector of selectors) {
        const spec = calculateForSelector(selector, walker);

        if (spec.a > maxA || (spec.a === maxA && spec.b > maxB) || (spec.a === maxA && spec.b === maxB && spec.c > maxC)) {
            maxA = spec.a;
            maxB = spec.b;
            maxC = spec.c;
        }
    }

    return { a: maxA, b: maxB, c: maxC };
};

export { calculateForSelector, maxSpecificity };
