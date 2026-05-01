import parse from 'css-tree/selector-parser';

/**
 * CSSTree adapter for the generic specificity calculator.
 *
 * @type {import('./calculate-generic.js').SelectorWalker}
 */
const csstreeWalker = {
    getType(node) {
        switch (node.type) {
            case 'IdSelector':
                return 'id';
            case 'ClassSelector':
                return 'class';
            case 'AttributeSelector':
                return 'attribute';
            case 'PseudoClassSelector':
                return 'pseudo-class';
            case 'PseudoElementSelector':
                return 'pseudo-element';
            case 'TypeSelector': {
                // Strip namespace prefix and check for universal selector
                let name = node.name;
                if (name.includes('|')) {
                    name = name.split('|')[1];
                }
                if (name === '*') {
                    return 'universal';
                }
                return 'type';
            }
            case 'Combinator':
                return 'combinator';
            default:
                return 'other';
        }
    },

    getName(node) {
        return node.name || '';
    },

    getChildren(selectorNode) {
        // CSSTree uses a linked list with .forEach / .first / .last
        // Convert to an iterable
        const children = [];
        if (selectorNode.children) {
            selectorNode.children.forEach((child) => {
                children.push(child);
            });
        }
        return children;
    },

    getSelectorListArgument(node) {
        const name = (node.name || '').toLowerCase();

        // :is(), :not(), :has(), :matches(), :-moz-any(), :-webkit-any(), :any()
        // These have children.first = SelectorList
        if (['is', 'not', 'has', 'matches', '-moz-any', '-webkit-any', 'any'].includes(name)) {
            const selectorList = node.children?.first;
            if (!selectorList) return null;
            return csstreeWalker._selectorListToArray(selectorList);
        }

        // :nth-child(), :nth-last-child()
        // These have children.first.selector = SelectorList (the "of" part)
        if (name === 'nth-child' || name === 'nth-last-child') {
            const selectorList = node.children?.first?.selector;
            if (!selectorList) return null;
            return csstreeWalker._selectorListToArray(selectorList);
        }

        // :host(), :host-context()
        // These have children.first = Selector (compound selector argument)
        // Workaround for CSSTree bug: it allows complex selectors, so we
        // truncate at the first Combinator
        if (name === 'host' || name === 'host-context') {
            if (!node.children?.first?.children) return null;
            const truncated = csstreeWalker._truncateAtCombinator(node.children.first);
            return [truncated];
        }

        // ::slotted() — same combinator truncation workaround
        if (node.type === 'PseudoElementSelector' && name === 'slotted') {
            if (!node.children?.first?.children) return null;
            const truncated = csstreeWalker._truncateAtCombinator(node.children.first);
            return [truncated];
        }

        return null;
    },

    getViewTransitionArgument(node) {
        return node.children?.first?.value ?? null;
    },

    // --- internal helpers ---

    /** Convert a CSSTree SelectorList (linked list) to an array of Selector nodes */
    _selectorListToArray(selectorList) {
        // Could be a Selector directly (single selector, not a list)
        if (selectorList.type === 'Selector') {
            return [selectorList];
        }

        // CSSTree sometimes produces Raw nodes (e.g. for :any() arguments)
        // Re-parse to get a proper SelectorList
        if (selectorList.type === 'Raw') {
            try {
                return csstreeWalker._selectorListToArray(parse(selectorList.value, { context: 'selectorList' }));
            } catch {
                return null;
            }
        }

        const selectors = [];
        selectorList.children.forEach((child) => {
            selectors.push(child);
        });
        return selectors;
    },

    /**
     * Workaround for CSSTree bug: :host() and ::slotted() should only accept
     * compound selectors, but CSSTree allows complex selectors. We truncate
     * at the first Combinator.
     */
    _truncateAtCombinator(selectorNode) {
        const children = [];
        let foundCombinator = false;
        selectorNode.children.forEach((entry) => {
            if (foundCombinator) return;
            if (entry.type === 'Combinator') {
                foundCombinator = true;
                return;
            }
            children.push(entry);
        });
        return { type: 'Selector', children };
    },
};

export { csstreeWalker };
