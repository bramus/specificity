import { equal, deepEqual } from 'assert';
import { calculate, compare, greaterThan, lessThan, equals, sort, ascending, descending, highest, lowest } from '../src/index.js';

describe('CALCULATE', () => {
    describe('Examples from the spec', () => {
        it('* = (0,0,0)', () => {
            deepEqual(calculate('*')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
        it('li = (0,0,1)', () => {
            deepEqual(calculate('li')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('ul li = (0,0,2)', () => {
            deepEqual(calculate('ul li')[0].toObject(), { a: 0, b: 0, c: 2 });
        });
        it('UL OL+LI  = (0,0,3)', () => {
            deepEqual(calculate('UL OL+LI ')[0].toObject(), { a: 0, b: 0, c: 3 });
        });
        it('H1 + *[REL=up] = (0,1,1)', () => {
            deepEqual(calculate('H1 + *[REL=up]')[0].toObject(), { a: 0, b: 1, c: 1 });
        });
        it('UL OL LI.red = (0,1,3)', () => {
            deepEqual(calculate('UL OL LI.red')[0].toObject(), { a: 0, b: 1, c: 3 });
        });
        it('LI.red.level = (0,2,1)', () => {
            deepEqual(calculate('LI.red.level')[0].toObject(), { a: 0, b: 2, c: 1 });
        });
        it('#x34y = (1,0,0)', () => {
            deepEqual(calculate('#x34y')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it('#s12:not(FOO) = (1,0,1)', () => {
            deepEqual(calculate('#s12:not(FOO)')[0].toObject(), { a: 1, b: 0, c: 1 });
        });
        it('.foo :is(.bar, #baz) = (1,1,0)', () => {
            deepEqual(calculate('.foo :is(.bar, #baz)')[0].toObject(), { a: 1, b: 1, c: 0 });
        });
    });

    describe('Examples by Kilian', () => {
        it('header h1#sitetitle > .logo = (1,1,2)', () => {
            deepEqual(calculate('header h1#sitetitle > .logo')[0].toObject(), { a: 1, b: 1, c: 2 });
        });
        it('ul > li:is(.highlighted, .active) = (0,1,2)', () => {
            deepEqual(calculate('ul > li:is(.highlighted, .active)')[0].toObject(), { a: 0, b: 1, c: 2 });
        });
        it('header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)', () => {
            deepEqual(calculate('header:where(#top) nav li:nth-child(2n + 1)')[0].toObject(), { a: 0, b: 1, c: 3 });
        });
    });

    describe('Examples by Kilian, remixed', () => {
        it('header:has(#top) nav li:nth-child(2n + 1) = (1,1,3)', () => {
            deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1)')[0].toObject(), { a: 1, b: 1, c: 3 });
        });
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo) = (1,2,3)', () => {
            deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo)')[0].toObject(), { a: 1, b: 2, c: 3 });
        });
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar) = (2,1,3)', () => {
            deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar)')[0].toObject(), { a: 2, b: 1, c: 3 });
        });
    });

    describe('Pseudo-Element Selector = (0,0,1)', () => {
        it('::after', () => {
            deepEqual(calculate('::after')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::cue', () => {
            deepEqual(calculate('::cue')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::before', () => {
            deepEqual(calculate('::before')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::first-line', () => {
            deepEqual(calculate('::first-line')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::first-letter', () => {
            deepEqual(calculate('::first-letter')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements#index
    describe('Pseudo-Element improperly used as Pseudo-Class Selector = (0,0,1)', () => {
        it(':before', () => {
            deepEqual(calculate(':before')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':after', () => {
            deepEqual(calculate(':after')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':first-line', () => {
            deepEqual(calculate(':first-line')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':first-letter', () => {
            deepEqual(calculate(':first-letter')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    describe('Pseudo-Class Selector = (0,1,0)', () => {
        it(':hover', () => {
            deepEqual(calculate(':hover')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
        it(':focus', () => {
            deepEqual(calculate(':focus')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
    });

    describe('CSS :is() - :matches() - :any() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':is(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':is(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':matches(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':matches(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':-moz-any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':-moz-any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':-webkit-any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':-webkit-any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :has() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':has(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':has(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :not() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':not(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(calculate(':not(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :where() = Replaced by zero', () => {
        it(':where(#foo, .bar, baz) = (0,0,0)', () => {
            deepEqual(calculate(':where(#foo, .bar, baz)')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
    });

    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors#namespaces
    describe('Namespaced Selectors', () => {
        it('ns|* = (0,0,0)', () => {
            deepEqual(calculate('ns|*')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
        it('ns|a = (0,0,1)', () => {
            deepEqual(calculate('ns|a')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    describe('Calculate accepts multiple selectors (i.e. a SelectorList)', () => {
        it('foo, .bar = [(0,0,1),(0,1,0)]', () => {
            deepEqual(calculate('foo, .bar')[0].toObject(), { a: 0, b: 0, c: 1 });
            deepEqual(calculate('foo, .bar')[1].toObject(), { a: 0, b: 1, c: 0 });
        });
    });
});

describe('COMPARE', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const [sHighObject, sMedObject, sLowObject] = calculate('#foo, .foo, baz');

    describe('compare (using plain Objects)', () => {
        it('compare(sHigh, sLow) = 1', () => {
            deepEqual(compare(sHigh, sLow), 1);
        });
        it('compare(sLow, sHigh) = -1', () => {
            deepEqual(compare(sLow, sHigh), -1);
        });
        it('compare(sMed, sMed) = 0', () => {
            deepEqual(compare(sMed, sMed), 0);
        });
    });

    describe('compare (using Specificity Instances)', () => {
        it('compare(sHighObject, sLowObject) = 1', () => {
            deepEqual(compare(sHighObject, sLowObject), 1);
        });
        it('compare(sLowObject, sHighObject) = -1', () => {
            deepEqual(compare(sLowObject, sHighObject), -1);
        });
        it('compare(sMedObject, sMedObject) = 0', () => {
            deepEqual(compare(sMedObject, sMedObject), 0);
        });
    });

    describe('greaterThan (using plain Objects)', () => {
        it('greaterThan(sHigh, sLow) = true', () => {
            deepEqual(greaterThan(sHigh, sLow), true);
        });
        it('greaterThan(sLow, sHigh) = false', () => {
            deepEqual(greaterThan(sLow, sHigh), false);
        });
        it('greaterThan(sMed, sMed) = false', () => {
            deepEqual(greaterThan(sMed, sMed), false);
        });
    });

    describe('greaterThan (using Specificity Instances)', () => {
        it('greaterThan(sHighObject, sLowObject) = true', () => {
            deepEqual(greaterThan(sHighObject, sLowObject), true);
        });
        it('greaterThan(sLowObject, sHighObject) = false', () => {
            deepEqual(greaterThan(sLowObject, sHighObject), false);
        });
        it('greaterThan(sMedObject, sMedObject) = false', () => {
            deepEqual(greaterThan(sMedObject, sMedObject), false);
        });
    });

    describe('lessThan (using plain Objects)', () => {
        it('lessThan(sHigh, sLow) = false', () => {
            deepEqual(lessThan(sHigh, sLow), false);
        });
        it('lessThan(sLow, sHigh) = true', () => {
            deepEqual(lessThan(sLow, sHigh), true);
        });
        it('lessThan(sMed, sMed) = false', () => {
            deepEqual(lessThan(sMed, sMed), false);
        });
    });

    describe('Call lessThan with Specificity Instances', () => {
        it('lessThan(sHighObject, sLowObject) = false', () => {
            deepEqual(lessThan(sHighObject, sLowObject), false);
        });
        it('lessThan(sLowObject, sHighObject) = true', () => {
            deepEqual(lessThan(sLowObject, sHighObject), true);
        });
        it('lessThan(sMedObject, sMedObject) = false', () => {
            deepEqual(lessThan(sMedObject, sMedObject), false);
        });
    });

    describe('equals (using plain Objects)', () => {
        it('equals(sHigh, sLow) = false', () => {
            deepEqual(equals(sHigh, sLow), false);
        });
        it('equals(sLow, sHigh) = false', () => {
            deepEqual(equals(sLow, sHigh), false);
        });
        it('equals(sMed, sMed) = true', () => {
            deepEqual(equals(sMed, sMed), true);
        });
    });

    describe('equals (using Specificity Instances)', () => {
        it('equals(sHighObject, sLowObject) = false', () => {
            deepEqual(equals(sHighObject, sLowObject), false);
        });
        it('equals(sLowObject, sHighObject) = false', () => {
            deepEqual(equals(sLowObject, sHighObject), false);
        });
        it('equals(sMedObject, sMedObject) = true', () => {
            deepEqual(equals(sMedObject, sMedObject), true);
        });
    });
});

describe('SORT', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const notSorted = [sMed, sHigh, sLow];
    const sortedHighToLow = [sHigh, sMed, sLow];
    const sortedLowToHigh = [sLow, sMed, sHigh];

    const notSortedObjects = calculate('.bar, #foo, baz');

    describe('ascending (using plain Objects)', () => {
        it('ascending(notSorted)', () => {
            deepEqual(ascending(notSorted), sortedLowToHigh);
        });
        it('sort(notSorted, "ASC")', () => {
            deepEqual(sort(notSorted, 'ASC'), sortedLowToHigh);
        });
    });

    describe('ascending (using Specificity Instances)', () => {
        it('ascending(notSortedObjects)', () => {
            deepEqual(
                ascending(notSortedObjects).map((s) => s.value),
                sortedLowToHigh
            );
        });
        it('sort(notSortedObjects, "ASC")', () => {
            deepEqual(
                sort(notSortedObjects, 'ASC').map((s) => s.value),
                sortedLowToHigh
            );
        });
    });

    describe('descending (using plain Objects)', () => {
        it('descending(notSorted)', () => {
            deepEqual(descending(notSorted), sortedHighToLow);
        });
        it('sort(notSorted, "DESC")', () => {
            deepEqual(sort(notSorted, 'DESC'), sortedHighToLow);
        });
    });

    describe('descending (using Specificity Instances)', () => {
        it('descending(notSortedObjects)', () => {
            deepEqual(
                descending(notSortedObjects).map((s) => s.value),
                sortedHighToLow
            );
        });
        it('sort(notSortedObjects, "DESC")', () => {
            deepEqual(
                sort(notSortedObjects, 'DESC').map((s) => s.value),
                sortedHighToLow
            );
        });
    });
});

describe('FILTER', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const notSorted = [sMed, sHigh, sLow];

    const notSortedObjects = calculate('.bar, #foo, baz');

    describe('highest (using plain Objects)', () => {
        it('highest(notSorted)', () => {
            deepEqual(highest(notSorted), sHigh);
        });
    });

    describe('highest (using Specificity Instances)', () => {
        it('highest(notSortedObjects)', () => {
            deepEqual(highest(notSortedObjects).value, sHigh);
        });
    });

    describe('lowest (using plain Objects)', () => {
        it('lowest(notSorted)', () => {
            deepEqual(lowest(notSorted), sLow);
        });
    });

    describe('lowest (using Specificity Instances)', () => {
        it('lowest(notSortedObjects)', () => {
            deepEqual(lowest(notSortedObjects).value, sLow);
        });
    });
});
