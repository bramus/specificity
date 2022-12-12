import { deepEqual } from 'assert';
import Specificity from '../dist/index.js';

describe('CALCULATE', () => {
    describe('Examples from the spec', () => {
        it('* = (0,0,0)', () => {
            deepEqual(Specificity.calculate('*')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
        it('li = (0,0,1)', () => {
            deepEqual(Specificity.calculate('li')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('ul li = (0,0,2)', () => {
            deepEqual(Specificity.calculate('ul li')[0].toObject(), { a: 0, b: 0, c: 2 });
        });
        it('UL OL+LI  = (0,0,3)', () => {
            deepEqual(Specificity.calculate('UL OL+LI ')[0].toObject(), { a: 0, b: 0, c: 3 });
        });
        it('H1 + *[REL=up] = (0,1,1)', () => {
            deepEqual(Specificity.calculate('H1 + *[REL=up]')[0].toObject(), { a: 0, b: 1, c: 1 });
        });
        it('UL OL LI.red = (0,1,3)', () => {
            deepEqual(Specificity.calculate('UL OL LI.red')[0].toObject(), { a: 0, b: 1, c: 3 });
        });
        it('LI.red.level = (0,2,1)', () => {
            deepEqual(Specificity.calculate('LI.red.level')[0].toObject(), { a: 0, b: 2, c: 1 });
        });
        it('#x34y = (1,0,0)', () => {
            deepEqual(Specificity.calculate('#x34y')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it('#s12:not(FOO) = (1,0,1)', () => {
            deepEqual(Specificity.calculate('#s12:not(FOO)')[0].toObject(), { a: 1, b: 0, c: 1 });
        });
        it('.foo :is(.bar, #baz) = (1,1,0)', () => {
            deepEqual(Specificity.calculate('.foo :is(.bar, #baz)')[0].toObject(), { a: 1, b: 1, c: 0 });
        });
    });

    describe('Examples by Kilian', () => {
        it('header h1#sitetitle > .logo = (1,1,2)', () => {
            deepEqual(Specificity.calculate('header h1#sitetitle > .logo')[0].toObject(), { a: 1, b: 1, c: 2 });
        });
        it('ul > li:is(.highlighted, .active) = (0,1,2)', () => {
            deepEqual(Specificity.calculate('ul > li:is(.highlighted, .active)')[0].toObject(), { a: 0, b: 1, c: 2 });
        });
        it('header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)', () => {
            deepEqual(Specificity.calculate('header:where(#top) nav li:nth-child(2n + 1)')[0].toObject(), { a: 0, b: 1, c: 3 });
        });
    });

    describe('Examples by Kilian, remixed', () => {
        it('header:has(#top) nav li:nth-child(2n + 1) = (1,1,3)', () => {
            deepEqual(Specificity.calculate('header:has(#top) nav li:nth-child(2n + 1)')[0].toObject(), { a: 1, b: 1, c: 3 });
        });
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo) = (1,2,3)', () => {
            deepEqual(Specificity.calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo)')[0].toObject(), { a: 1, b: 2, c: 3 });
        });
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar) = (2,1,3)', () => {
            deepEqual(Specificity.calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar)')[0].toObject(), { a: 2, b: 1, c: 3 });
        });
    });

    describe('Pseudo-Element Selector = (0,0,1)', () => {
        it('::after', () => {
            deepEqual(Specificity.calculate('::after')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::cue', () => {
            deepEqual(Specificity.calculate('::cue')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::before', () => {
            deepEqual(Specificity.calculate('::before')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::first-line', () => {
            deepEqual(Specificity.calculate('::first-line')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::first-letter', () => {
            deepEqual(Specificity.calculate('::first-letter')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    describe('Pseudo-Element Selector ::slotted', () => {
        it('::slotted', () => {
            deepEqual(Specificity.calculate('::slotted')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it.skip('::slotted()', () => {
            deepEqual(Specificity.calculate('::slotted()')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it('::slotted(div#foo)', () => {
            deepEqual(Specificity.calculate('::slotted(div#foo)')[0].toObject(), { a: 1, b: 0, c: 2 });
        });
        it('::slotted(#foo invalid)', () => {
            deepEqual(Specificity.calculate('::slotted(#foo invalid)')[0].toObject(), { a: 1, b: 0, c: 1 });
        });
        it('::slotted(#foo.bar)', () => {
            deepEqual(Specificity.calculate('::slotted(#foo.bar)')[0].toObject(), { a: 1, b: 1, c: 1 });
        });
        it('::slotted(#foo.bar invalid)', () => {
            deepEqual(Specificity.calculate('::slotted(#foo.bar invalid)')[0].toObject(), { a: 1, b: 1, c: 1 });
        });
    });

    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements#index
    describe('Pseudo-Class improperly used instead of Pseudo-Element Selector = (0,0,1)', () => {
        it(':before', () => {
            deepEqual(Specificity.calculate(':before')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':after', () => {
            deepEqual(Specificity.calculate(':after')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':first-line', () => {
            deepEqual(Specificity.calculate(':first-line')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
        it(':first-letter', () => {
            deepEqual(Specificity.calculate(':first-letter')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    describe('Pseudo-Class Selector = (0,1,0)', () => {
        it(':hover', () => {
            deepEqual(Specificity.calculate(':hover')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
        it(':focus', () => {
            deepEqual(Specificity.calculate(':focus')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
    });

    describe('CSS :is() - :matches() - :any() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':is(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':is(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':matches(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':matches(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':-moz-any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':-moz-any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
        it(':-webkit-any(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':-webkit-any(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :has() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':has(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':has(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :not() = Specificity of the most specific complex selector in its selector list argument', () => {
        it(':not(#foo, .bar, baz) = (1,0,0)', () => {
            deepEqual(Specificity.calculate(':not(#foo, .bar, baz)')[0].toObject(), { a: 1, b: 0, c: 0 });
        });
    });

    describe('CSS :where() = Replaced by zero', () => {
        it(':where(#foo, .bar, baz) = (0,0,0)', () => {
            deepEqual(Specificity.calculate(':where(#foo, .bar, baz)')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
    });

    describe('CSS :host() / :host-context() = Pseudo-class, plus the specificity of its argument', () => {
        it(':host = (0,1,0)', () => {
            deepEqual(Specificity.calculate(':host')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
        it.skip(':host() = (0,1,0)', () => {
            deepEqual(Specificity.calculate(':host()')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
        it(':host(#foo.bar) = (1,2,0)', () => {
            deepEqual(Specificity.calculate(':host(#foo.bar)')[0].toObject(), { a: 1, b: 2, c: 0 });
        });
        it(':host(#foo.bar invalid) = (1,2,0)', () => {
            deepEqual(Specificity.calculate(':host(#foo.bar invalid)')[0].toObject(), { a: 1, b: 2, c: 0 });
        });
        it.skip(':host-context() = (0,1,0)', () => {
            deepEqual(Specificity.calculate(':host-context()')[0].toObject(), { a: 0, b: 1, c: 0 });
        });
        it(':host-context(#foo.bar) = (1,2,0)', () => {
            deepEqual(Specificity.calculate(':host-context(#foo.bar)')[0].toObject(), { a: 1, b: 2, c: 0 });
        });
        it(':host-context(#foo.bar invalid) = (1,2,0)', () => {
            deepEqual(Specificity.calculate(':host-context(#foo.bar invalid)')[0].toObject(), { a: 1, b: 2, c: 0 });
        });
    });

    // @ref https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors#namespaces
    describe('Namespaced Selectors', () => {
        it('ns|* = (0,0,0)', () => {
            deepEqual(Specificity.calculate('ns|*')[0].toObject(), { a: 0, b: 0, c: 0 });
        });
        it('ns|a = (0,0,1)', () => {
            deepEqual(Specificity.calculate('ns|a')[0].toObject(), { a: 0, b: 0, c: 1 });
        });
    });

    describe('Calculate accepts multiple selectors (i.e. a SelectorList)', () => {
        it('foo, .bar = [(0,0,1),(0,1,0)]', () => {
            deepEqual(Specificity.calculate('foo, .bar')[0].toObject(), { a: 0, b: 0, c: 1 });
            deepEqual(Specificity.calculate('foo, .bar')[1].toObject(), { a: 0, b: 1, c: 0 });
        });
    });

    describe('Calculate accepts an empty value', () => {
        it('"" = []', () => {
            deepEqual(Specificity.calculate(''), []);
        });
    });
});

describe('COMPARE', () => {
    const sHigh = { a: 1, b: 0, c: 0 };
    const sMed = { a: 0, b: 1, c: 0 };
    const sLow = { a: 0, b: 0, c: 1 };

    const [sHighObject, sMedObject, sLowObject] = Specificity.calculate('#foo, .foo, baz');

    describe('compare (using plain Objects)', () => {
        it('compare(sHigh, sLow) = 1', () => {
            deepEqual(Specificity.compare(sHigh, sLow), 1);
        });
        it('compare(sLow, sHigh) = -1', () => {
            deepEqual(Specificity.compare(sLow, sHigh), -1);
        });
        it('compare(sMed, sMed) = 0', () => {
            deepEqual(Specificity.compare(sMed, sMed), 0);
        });
    });

    describe('compare (using Specificity Instances)', () => {
        it('compare(sHighObject, sLowObject) = 1', () => {
            deepEqual(Specificity.compare(sHighObject, sLowObject), 1);
        });
        it('compare(sLowObject, sHighObject) = -1', () => {
            deepEqual(Specificity.compare(sLowObject, sHighObject), -1);
        });
        it('compare(sMedObject, sMedObject) = 0', () => {
            deepEqual(Specificity.compare(sMedObject, sMedObject), 0);
        });
    });

    describe('greaterThan (using plain Objects)', () => {
        it('greaterThan(sHigh, sLow) = true', () => {
            deepEqual(Specificity.greaterThan(sHigh, sLow), true);
        });
        it('greaterThan(sLow, sHigh) = false', () => {
            deepEqual(Specificity.greaterThan(sLow, sHigh), false);
        });
        it('greaterThan(sMed, sMed) = false', () => {
            deepEqual(Specificity.greaterThan(sMed, sMed), false);
        });
    });

    describe('greaterThan (using Specificity Instances)', () => {
        it('greaterThan(sHighObject, sLowObject) = true', () => {
            deepEqual(Specificity.greaterThan(sHighObject, sLowObject), true);
        });
        it('greaterThan(sLowObject, sHighObject) = false', () => {
            deepEqual(Specificity.greaterThan(sLowObject, sHighObject), false);
        });
        it('greaterThan(sMedObject, sMedObject) = false', () => {
            deepEqual(Specificity.greaterThan(sMedObject, sMedObject), false);
        });
    });

    describe('lessThan (using plain Objects)', () => {
        it('lessThan(sHigh, sLow) = false', () => {
            deepEqual(Specificity.lessThan(sHigh, sLow), false);
        });
        it('lessThan(sLow, sHigh) = true', () => {
            deepEqual(Specificity.lessThan(sLow, sHigh), true);
        });
        it('lessThan(sMed, sMed) = false', () => {
            deepEqual(Specificity.lessThan(sMed, sMed), false);
        });
    });

    describe('Call lessThan with Specificity Instances', () => {
        it('lessThan(sHighObject, sLowObject) = false', () => {
            deepEqual(Specificity.lessThan(sHighObject, sLowObject), false);
        });
        it('lessThan(sLowObject, sHighObject) = true', () => {
            deepEqual(Specificity.lessThan(sLowObject, sHighObject), true);
        });
        it('lessThan(sMedObject, sMedObject) = false', () => {
            deepEqual(Specificity.lessThan(sMedObject, sMedObject), false);
        });
    });

    describe('equals (using plain Objects)', () => {
        it('equals(sHigh, sLow) = false', () => {
            deepEqual(Specificity.equals(sHigh, sLow), false);
        });
        it('equals(sLow, sHigh) = false', () => {
            deepEqual(Specificity.equals(sLow, sHigh), false);
        });
        it('equals(sMed, sMed) = true', () => {
            deepEqual(Specificity.equals(sMed, sMed), true);
        });
    });

    describe('equals (using Specificity Instances)', () => {
        it('equals(sHighObject, sLowObject) = false', () => {
            deepEqual(Specificity.equals(sHighObject, sLowObject), false);
        });
        it('equals(sLowObject, sHighObject) = false', () => {
            deepEqual(Specificity.equals(sLowObject, sHighObject), false);
        });
        it('equals(sMedObject, sMedObject) = true', () => {
            deepEqual(Specificity.equals(sMedObject, sMedObject), true);
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

    const notSortedObjects = Specificity.calculate('.bar, #foo, baz');

    describe('sortAsc (using plain Objects)', () => {
        it('sortAsc(notSorted)', () => {
            deepEqual(Specificity.sortAsc(...notSorted), sortedLowToHigh);
        });
    });

    describe('sortAsc (using Specificity Instances)', () => {
        it('sortAsc(notSortedObjects)', () => {
            deepEqual(
                Specificity.sortAsc(...notSortedObjects).map((s) => s.value),
                sortedLowToHigh
            );
        });
    });

    describe('sortDesc (using plain Objects)', () => {
        it('sortDesc(notSorted)', () => {
            deepEqual(Specificity.sortDesc(...notSorted), sortedHighToLow);
        });
    });

    describe('sortDesc (using Specificity Instances)', () => {
        it('sortDesc(notSortedObjects)', () => {
            deepEqual(
                Specificity.sortDesc(...notSortedObjects).map((s) => s.value),
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

    const notSortedObjects = Specificity.calculate('.bar, #foo, baz');

    describe('max (using plain Objects)', () => {
        it('max(notSorted)', () => {
            deepEqual(Specificity.max(...notSorted), sHigh);
        });
    });

    describe('max (using Specificity Instances)', () => {
        it('max(notSortedObjects)', () => {
            deepEqual(Specificity.max(...notSortedObjects).value, sHigh);
        });
    });

    describe('min (using plain Objects)', () => {
        it('min(notSorted)', () => {
            deepEqual(Specificity.min(...notSorted), sLow);
        });
    });

    describe('min (using Specificity Instances)', () => {
        it('min(notSortedObjects)', () => {
            deepEqual(Specificity.min(...notSortedObjects).value, sLow);
        });
    });
});
