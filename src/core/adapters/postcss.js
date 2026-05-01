import selectorParser from 'postcss-selector-parser';

const postcssWalker = {
    getType(node) {
        if (selectorParser.isPseudoElement(node)) return 'pseudo-element';
        switch (node.type) {
            case 'id':
                return 'id';
            case 'class':
                return 'class';
            case 'attribute':
                return 'attribute';
            case 'pseudo':
                return 'pseudo-class';
            case 'tag':
                return 'type';
            case 'universal':
                return 'universal';
            case 'combinator':
                return 'combinator';
            case 'selector':
                return 'other'; // container node
            default:
                return 'other';
        }
    },

    getName(node) {
        // postcss-selector-parser stores name as value with colons
        const val = (node.value || '').replace(/^::?/, '');
        return val;
    },

    getChildren(selectorNode) {
        return selectorNode.nodes || [];
    },

    getSelectorListArgument(node) {
        const name = postcssWalker.getName(node).toLowerCase();

        const FORGIVING = ['is', 'not', 'has', 'matches', '-moz-any', '-webkit-any', 'any'];
        if (FORGIVING.includes(name)) {
            if (!node.nodes || node.nodes.length === 0) return null;
            return node.nodes;
        }

        if (name === 'nth-child' || name === 'nth-last-child') {
            if (!node.nodes || node.nodes.length === 0) return null;
            // Find the "of" keyword in the first selector's nodes, then extract the rest
            const firstSelector = node.nodes[0];
            if (!firstSelector?.nodes) return null;
            const ofIndex = firstSelector.nodes.findIndex((n) => n.type === 'tag' && n.value?.toLowerCase() === 'of');
            if (ofIndex === -1) return null;

            // Build a new selector from nodes after "of"
            const ofSelector = selectorParser.selector({ nodes: [], value: '' });
            firstSelector.nodes.slice(ofIndex + 1).forEach((n) => {
                ofSelector.append(n.clone());
            });
            const result = [ofSelector];
            if (node.nodes.length > 1) {
                result.push(...node.nodes.slice(1));
            }
            return result;
        }

        if (name === 'host' || name === 'host-context') {
            if (!node.nodes || node.nodes.length === 0) return null;
            return node.nodes;
        }

        // ::slotted()
        if (selectorParser.isPseudoElement(node) && name === 'slotted') {
            if (!node.nodes || node.nodes.length === 0) return null;
            return node.nodes;
        }

        return null;
    },

    getViewTransitionArgument(node) {
        if (!node.nodes || node.nodes.length === 0) return null;
        const firstSelector = node.nodes[0];
        if (!firstSelector?.nodes?.[0]) return null;
        const first = firstSelector.nodes[0];
        if (first.type === 'universal') return '*';
        return first.value || null;
    },
};

export { postcssWalker };
