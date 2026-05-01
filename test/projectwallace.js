import { deepEqual } from 'assert';
import { parse_selector } from '@projectwallace/css-parser';
import { calculateForSelector } from '../src/core/calculate-generic.js';
import { projectwallaceWalker } from '../src/core/adapters/projectwallace.js';

const calc = (selector) => {
    const ast = parse_selector(selector);
    return calculateForSelector(ast.children[0], projectwallaceWalker);
};

describe('GENERIC CALCULATOR + PROJECT WALLACE ADAPTER', () => {
    describe('Examples from the spec', () => {
        it('* = (0,0,0)', () => deepEqual(calc('*'), { a: 0, b: 0, c: 0 }));
        it('li = (0,0,1)', () => deepEqual(calc('li'), { a: 0, b: 0, c: 1 }));
        it('ul li = (0,0,2)', () => deepEqual(calc('ul li'), { a: 0, b: 0, c: 2 }));
        it('UL OL+LI = (0,0,3)', () => deepEqual(calc('UL OL+LI'), { a: 0, b: 0, c: 3 }));
        it('H1 + *[REL=up] = (0,1,1)', () => deepEqual(calc('H1 + *[REL=up]'), { a: 0, b: 1, c: 1 }));
        it('UL OL LI.red = (0,1,3)', () => deepEqual(calc('UL OL LI.red'), { a: 0, b: 1, c: 3 }));
        it('LI.red.level = (0,2,1)', () => deepEqual(calc('LI.red.level'), { a: 0, b: 2, c: 1 }));
        it('#x34y = (1,0,0)', () => deepEqual(calc('#x34y'), { a: 1, b: 0, c: 0 }));
        it('#s12:not(FOO) = (1,0,1)', () => deepEqual(calc('#s12:not(FOO)'), { a: 1, b: 0, c: 1 }));
        it('.foo :is(.bar, #baz) = (1,1,0)', () => deepEqual(calc('.foo :is(.bar, #baz)'), { a: 1, b: 1, c: 0 }));
    });

    describe('Pseudo-elements', () => {
        it('::after = (0,0,1)', () => deepEqual(calc('::after'), { a: 0, b: 0, c: 1 }));
        it('::before = (0,0,1)', () => deepEqual(calc('::before'), { a: 0, b: 0, c: 1 }));
        it('::first-line = (0,0,1)', () => deepEqual(calc('::first-line'), { a: 0, b: 0, c: 1 }));
        it('::first-letter = (0,0,1)', () => deepEqual(calc('::first-letter'), { a: 0, b: 0, c: 1 }));
    });

    describe('Legacy pseudo-element syntax', () => {
        it(':before = (0,0,1)', () => deepEqual(calc(':before'), { a: 0, b: 0, c: 1 }));
        it(':after = (0,0,1)', () => deepEqual(calc(':after'), { a: 0, b: 0, c: 1 }));
        it(':first-line = (0,0,1)', () => deepEqual(calc(':first-line'), { a: 0, b: 0, c: 1 }));
        it(':first-letter = (0,0,1)', () => deepEqual(calc(':first-letter'), { a: 0, b: 0, c: 1 }));
    });

    describe('Pseudo-classes', () => {
        it(':hover = (0,1,0)', () => deepEqual(calc(':hover'), { a: 0, b: 1, c: 0 }));
        it(':focus = (0,1,0)', () => deepEqual(calc(':focus'), { a: 0, b: 1, c: 0 }));
    });

    describe(':where() = zero specificity', () => {
        it(':where(#foo, .bar, baz) = (0,0,0)', () => deepEqual(calc(':where(#foo, .bar, baz)'), { a: 0, b: 0, c: 0 }));
    });

    describe(':is(), :not(), :has()', () => {
        it(':is(#foo, .bar, baz) = (1,0,0)', () => deepEqual(calc(':is(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }));
        it(':not(#foo, .bar, baz) = (1,0,0)', () => deepEqual(calc(':not(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }));
        it(':has(#foo, .bar, baz) = (1,0,0)', () => deepEqual(calc(':has(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }));
    });

    describe(':nth-child() with of selector', () => {
        it('header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)', () => deepEqual(calc('header:where(#top) nav li:nth-child(2n + 1)'), { a: 0, b: 1, c: 3 }));
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo) = (1,2,3)', () => deepEqual(calc('header:has(#top) nav li:nth-child(2n + 1 of .foo)'), { a: 1, b: 2, c: 3 }));
        it('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar) = (2,1,3)', () => deepEqual(calc('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar)'), { a: 2, b: 1, c: 3 }));
    });

    describe(':host()', () => {
        it(':host = (0,1,0)', () => deepEqual(calc(':host'), { a: 0, b: 1, c: 0 }));
        it(':host(.foo) = (0,2,0)', () => deepEqual(calc(':host(.foo)'), { a: 0, b: 2, c: 0 }));
    });

    describe('::slotted()', () => {
        it('::slotted(div) = (0,0,2)', () => deepEqual(calc('::slotted(div)'), { a: 0, b: 0, c: 2 }));
    });
});
