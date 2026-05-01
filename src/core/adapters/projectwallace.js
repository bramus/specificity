const ID_SELECTOR = 23;
const CLASS_SELECTOR = 22;
const ATTRIBUTE_SELECTOR = 24;
const PSEUDO_CLASS_SELECTOR = 25;
const PSEUDO_ELEMENT_SELECTOR = 26;
const TYPE_SELECTOR = 21;
const UNIVERSAL_SELECTOR = 28;
const COMBINATOR = 27;
const NTH_OF_SELECTOR = 31;
const SELECTOR_LIST = 20;

const FORGIVING = new Set(['is', 'not', 'has', 'matches', '-moz-any', '-webkit-any', 'any']);

const projectwallaceWalker = {
    getType(node) {
        switch (node.type) {
            case ID_SELECTOR:
                return 'id';
            case CLASS_SELECTOR:
                return 'class';
            case ATTRIBUTE_SELECTOR:
                return 'attribute';
            case PSEUDO_CLASS_SELECTOR:
                return 'pseudo-class';
            case PSEUDO_ELEMENT_SELECTOR:
                return 'pseudo-element';
            case TYPE_SELECTOR:
                return 'type';
            case UNIVERSAL_SELECTOR:
                return 'universal';
            case COMBINATOR:
                return 'combinator';
            default:
                return 'other';
        }
    },

    getName(node) {
        return node.name || '';
    },

    getChildren(selectorNode) {
        return selectorNode || [];
    },

    getSelectorListArgument(node) {
        const name = (node.name || '').toLowerCase();

        if (FORGIVING.has(name)) {
            if (!node.has_children) return null;
            // Children are SelectorList nodes; unwrap to get Selector nodes
            for (const child of node) {
                if (child.type === SELECTOR_LIST) {
                    return child.children || [];
                }
            }
            return node.children;
        }

        if (name === 'nth-child' || name === 'nth-last-child') {
            if (!node.has_children) return null;
            for (const child of node) {
                if (child.type === NTH_OF_SELECTOR && child.selector) {
                    return child.selector.children || [];
                }
            }
            return null;
        }

        if (name === 'host' || name === 'host-context') {
            if (!node.has_children) return null;
            for (const child of node) {
                if (child.type === SELECTOR_LIST) {
                    return child.children || [];
                }
            }
            return node.children;
        }

        if (node.type === PSEUDO_ELEMENT_SELECTOR && name === 'slotted') {
            if (!node.has_children) return null;
            // children contain a SelectorList whose children are Selectors
            for (const child of node) {
                if (child.type === SELECTOR_LIST) {
                    return child.children || [];
                }
            }
            // or children are Selector nodes directly
            return node.children;
        }

        return null;
    },

    getViewTransitionArgument(node) {
        if (!node.has_children) return null;
        // first child's text is the ident argument
        const first = node.children?.[0];
        if (!first) return null;
        return first.text || first.name || null;
    },
};

export { projectwallaceWalker };
