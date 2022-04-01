import { deepEqual } from 'assert';
import * as csstree from 'css-tree';
import Specificity from '../dist/index.js';

import { calculate } from './../src/core/index.js';
import { compare, equals, greaterThan, lessThan } from './../src/util/compare.js';
import { min, max } from './../src/util/filter.js';
import { sortAsc, sortDesc } from './../src/util/sort.js';

describe('STANDALONE CALCULATE', () => {
    describe('Examples by Kilian', () => {
        it('header h1#sitetitle > .logo = (1,1,2)', () => {
            deepEqual(Specificity.calculate('header h1#sitetitle > .logo')[0].toObject(), calculate('header h1#sitetitle > .logo')[0].toObject());
        });
        it('ul > li:is(.highlighted, .active) = (0,1,2)', () => {
            deepEqual(Specificity.calculate('ul > li:is(.highlighted, .active)')[0].toObject(), calculate('ul > li:is(.highlighted, .active)')[0].toObject());
        });
        it('header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)', () => {
            deepEqual(Specificity.calculate('header:where(#top) nav li:nth-child(2n + 1)')[0].toObject(), calculate('header:where(#top) nav li:nth-child(2n + 1)')[0].toObject());
        });
    });
});

describe('STANDALONE CACULATE WITH PREPARSED AST', () => {
    const css = `
        html #test, .class[cool] {
            color: red;
        }
        foo {
            background: lime;
        }
    `;

    const ast = csstree.parse(css);

    describe('Pass a SelectorList into calculate', () => {
        const selectorLists = csstree.findAll(ast, (node) => node.type === 'SelectorList');

        deepEqual(Specificity.calculate(selectorLists[0])[0].toObject(), { a: 1, b: 0, c: 1 });
        deepEqual(Specificity.calculate(selectorLists[0])[1].toObject(), { a: 0, b: 2, c: 0 });
        deepEqual(Specificity.calculate(selectorLists[1])[0].toObject(), { a: 0, b: 0, c: 1 });
    });

    describe('Selector', () => {
        const selectors = csstree.findAll(ast, (node) => node.type === 'Selector');

        deepEqual(Specificity.calculate(selectors[0])[0].toObject(), { a: 1, b: 0, c: 1 });
        deepEqual(Specificity.calculate(selectors[1])[0].toObject(), { a: 0, b: 2, c: 0 });
        deepEqual(Specificity.calculate(selectors[2])[0].toObject(), { a: 0, b: 0, c: 1 });
    });
});

describe('STANDALONE COMPARE', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const [sHighObject, sMedObject, sLowObject] = Specificity.calculate('#foo, .foo, baz');

    describe('compare (using plain Objects)', () => {
        it('compare(sHigh, sLow) = 1', () => {
            deepEqual(Specificity.compare(sHigh, sLow), compare(sHigh, sLow));
        });
        it('compare(sLow, sHigh) = -1', () => {
            deepEqual(Specificity.compare(sLow, sHigh), compare(sLow, sHigh));
        });
        it('compare(sMed, sMed) = 0', () => {
            deepEqual(Specificity.compare(sMed, sMed), compare(sMed, sMed));
        });
    });

    describe('compare (using Specificity Instances)', () => {
        it('compare(sHighObject, sLowObject) = 1', () => {
            deepEqual(Specificity.compare(sHighObject, sLowObject), compare(sHighObject, sLowObject));
        });
        it('compare(sLowObject, sHighObject) = -1', () => {
            deepEqual(Specificity.compare(sLowObject, sHighObject), compare(sLowObject, sHighObject));
        });
        it('compare(sMedObject, sMedObject) = 0', () => {
            deepEqual(Specificity.compare(sMedObject, sMedObject), compare(sMedObject, sMedObject));
        });
    });

    describe('greaterThan (using plain Objects)', () => {
        it('greaterThan(sHigh, sLow) = true', () => {
            deepEqual(Specificity.greaterThan(sHigh, sLow), greaterThan(sHigh, sLow));
        });
        it('greaterThan(sLow, sHigh) = false', () => {
            deepEqual(Specificity.greaterThan(sLow, sHigh), greaterThan(sLow, sHigh));
        });
        it('greaterThan(sMed, sMed) = false', () => {
            deepEqual(Specificity.greaterThan(sMed, sMed), greaterThan(sMed, sMed));
        });
    });

    describe('greaterThan (using Specificity Instances)', () => {
        it('greaterThan(sHighObject, sLowObject) = true', () => {
            deepEqual(Specificity.greaterThan(sHighObject, sLowObject), greaterThan(sHighObject, sLowObject));
        });
        it('greaterThan(sLowObject, sHighObject) = false', () => {
            deepEqual(Specificity.greaterThan(sLowObject, sHighObject), greaterThan(sLowObject, sHighObject));
        });
        it('greaterThan(sMedObject, sMedObject) = false', () => {
            deepEqual(Specificity.greaterThan(sMedObject, sMedObject), greaterThan(sMedObject, sMedObject));
        });
    });

    describe('lessThan (using plain Objects)', () => {
        it('lessThan(sHigh, sLow) = false', () => {
            deepEqual(Specificity.lessThan(sHigh, sLow), lessThan(sHigh, sLow));
        });
        it('lessThan(sLow, sHigh) = true', () => {
            deepEqual(Specificity.lessThan(sLow, sHigh), lessThan(sLow, sHigh));
        });
        it('lessThan(sMed, sMed) = false', () => {
            deepEqual(Specificity.lessThan(sMed, sMed), lessThan(sMed, sMed));
        });
    });

    describe('Call lessThan with Specificity Instances', () => {
        it('lessThan(sHighObject, sLowObject) = false', () => {
            deepEqual(Specificity.lessThan(sHighObject, sLowObject), lessThan(sHighObject, sLowObject));
        });
        it('lessThan(sLowObject, sHighObject) = true', () => {
            deepEqual(Specificity.lessThan(sLowObject, sHighObject), lessThan(sLowObject, sHighObject));
        });
        it('lessThan(sMedObject, sMedObject) = false', () => {
            deepEqual(Specificity.lessThan(sMedObject, sMedObject), lessThan(sMedObject, sMedObject));
        });
    });

    describe('equals (using plain Objects)', () => {
        it('equals(sHigh, sLow) = false', () => {
            deepEqual(Specificity.equals(sHigh, sLow), equals(sHigh, sLow));
        });
        it('equals(sLow, sHigh) = false', () => {
            deepEqual(Specificity.equals(sLow, sHigh), equals(sLow, sHigh));
        });
        it('equals(sMed, sMed) = true', () => {
            deepEqual(Specificity.equals(sMed, sMed), equals(sMed, sMed));
        });
    });

    describe('equals (using Specificity Instances)', () => {
        it('equals(sHighObject, sLowObject) = false', () => {
            deepEqual(Specificity.equals(sHighObject, sLowObject), equals(sHighObject, sLowObject));
        });
        it('equals(sLowObject, sHighObject) = false', () => {
            deepEqual(Specificity.equals(sLowObject, sHighObject), equals(sLowObject, sHighObject));
        });
        it('equals(sMedObject, sMedObject) = true', () => {
            deepEqual(Specificity.equals(sMedObject, sMedObject), equals(sMedObject, sMedObject));
        });
    });
});

describe('STANDALONE SORT', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const notSorted = [sMed, sHigh, sLow];
    const notSortedObjects = Specificity.calculate('.bar, #foo, baz');

    describe('sortAsc (using plain Objects)', () => {
        it('sortAsc(notSorted)', () => {
            deepEqual(Specificity.sortAsc(...notSorted), sortAsc(...notSorted));
        });
    });

    describe('sortAsc (using Specificity Instances)', () => {
        it('sortAsc(notSortedObjects)', () => {
            deepEqual(
                Specificity.sortAsc(...notSortedObjects).map((s) => s.value),
                sortAsc(...notSortedObjects).map((s) => s.value)
            );
        });
    });

    describe('sortDesc (using plain Objects)', () => {
        it('sortDesc(notSorted)', () => {
            deepEqual(Specificity.sortDesc(...notSorted), sortDesc(...notSorted));
        });
    });

    describe('sortDesc (using Specificity Instances)', () => {
        it('sortDesc(notSortedObjects)', () => {
            deepEqual(
                Specificity.sortDesc(...notSortedObjects).map((s) => s.value),
                sortDesc(...notSortedObjects).map((s) => s.value)
            );
        });
    });
});

describe('STANDALONE FILTER', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const notSorted = [sMed, sHigh, sLow];

    const notSortedObjects = Specificity.calculate('.bar, #foo, baz');

    describe('max (using plain Objects)', () => {
        it('max(notSorted)', () => {
            deepEqual(Specificity.max(...notSorted), max(...notSorted));
        });
    });

    describe('max (using Specificity Instances)', () => {
        it('max(notSortedObjects)', () => {
            deepEqual(Specificity.max(...notSortedObjects).value, max(...notSortedObjects).value);
        });
    });

    describe('min (using plain Objects)', () => {
        it('min(notSorted)', () => {
            deepEqual(Specificity.min(...notSorted), min(...notSorted));
        });
    });

    describe('min (using Specificity Instances)', () => {
        it('min(notSortedObjects)', () => {
            deepEqual(Specificity.min(...notSortedObjects).value, min(...notSortedObjects).value);
        });
    });
});
