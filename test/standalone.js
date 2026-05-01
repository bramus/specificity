import { deepEqual } from 'assert';

import packageinfo from './../package.json' with { type: 'json' };

describe('STANDALONE EXPORTS', async () => {
    const expected = {
        './core': ['calculate', 'calculateForAST', 'calculateForSelector', 'maxSpecificity'],
        './generic': ['calculateForSelector', 'maxSpecificity'],
        './adapters/csstree': ['csstreeWalker'],
        './adapters/projectwallace': ['projectwallaceWalker'],
        './util': ['compare', 'equals', 'greaterThan', 'lessThan', 'max', 'min', 'sortAsc', 'sortDesc'],
        './compare': ['compare', 'equals', 'greaterThan', 'lessThan'],
        './filter': ['max', 'min'],
        './sort': ['sortAsc', 'sortDesc'],
    };

    // Adapters with optional peer dependencies that may not be installed
    const optionalSubpaths = new Set(['./adapters/postcss']);

    // Build list of exported subpaths
    const exported = {};
    for (const [subpath_key, subpath_contents] of Object.entries(packageinfo.exports)) {
        if (subpath_key !== '.' && subpath_contents['import']) {
            if (optionalSubpaths.has(subpath_key)) continue;
            try {
                const imported = await import(`./../${subpath_contents['import']}`);
                exported[subpath_key] = Object.keys(imported);
            } catch {
                // skip subpaths with unresolved dependencies
            }
        }
    }

    describe('The subpath exports export the correct set of functions', () => {
        for (const [key, functions] of Object.entries(expected)) {
            it(`${key} exports ${functions.length} functions (${functions})`, () => {
                deepEqual(exported[key], functions);
            });
        }
    });
});
