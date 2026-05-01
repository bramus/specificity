import { deepEqual } from 'assert';
import selectorParser from 'postcss-selector-parser';
import { calculateForSelector } from '../src/core/calculate-generic.js';
import { postcssWalker } from '../src/core/adapters/postcss.js';

const calc = (selector) => {
    const root = selectorParser().astSync(selector);
    return root.nodes.map((sel) => calculateForSelector(sel, postcssWalker));
};
const s = (selector) => calc(selector)[0];

describe('PostCSS adapter', () => {
    describe('Spec examples', () => {
        it('*', () => deepEqual(s('*'), { a: 0, b: 0, c: 0 }));
        it('li', () => deepEqual(s('li'), { a: 0, b: 0, c: 1 }));
        it('ul li', () => deepEqual(s('ul li'), { a: 0, b: 0, c: 2 }));
        it('UL OL+LI', () => deepEqual(s('UL OL+LI'), { a: 0, b: 0, c: 3 }));
        it('H1 + *[REL=up]', () => deepEqual(s('H1 + *[REL=up]'), { a: 0, b: 1, c: 1 }));
        it('UL OL LI.red', () => deepEqual(s('UL OL LI.red'), { a: 0, b: 1, c: 3 }));
        it('LI.red.level', () => deepEqual(s('LI.red.level'), { a: 0, b: 2, c: 1 }));
        it('#x34y', () => deepEqual(s('#x34y'), { a: 1, b: 0, c: 0 }));
        it('#s12:not(FOO)', () => deepEqual(s('#s12:not(FOO)'), { a: 1, b: 0, c: 1 }));
        it('.foo :is(.bar, #baz)', () => deepEqual(s('.foo :is(.bar, #baz)'), { a: 1, b: 1, c: 0 }));
    });

    describe('Pseudo-elements', () => {
        it('::after', () => deepEqual(s('::after'), { a: 0, b: 0, c: 1 }));
        it('::before', () => deepEqual(s('::before'), { a: 0, b: 0, c: 1 }));
        it('::first-line', () => deepEqual(s('::first-line'), { a: 0, b: 0, c: 1 }));
    });

    describe('Legacy pseudo-elements as pseudo-class', () => {
        it(':before', () => deepEqual(s(':before'), { a: 0, b: 0, c: 1 }));
        it(':after', () => deepEqual(s(':after'), { a: 0, b: 0, c: 1 }));
    });

    describe(':where()', () => {
        it(':where(#foo, .bar, baz)', () => deepEqual(s(':where(#foo, .bar, baz)'), { a: 0, b: 0, c: 0 }));
    });

    describe(':is(), :not(), :has()', () => {
        it(':is(#foo, .bar, baz)', () => deepEqual(s(':is(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }));
        it(':not(#foo, .bar, baz)', () => deepEqual(s(':not(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }));
        it(':has(#foo, .bar, baz)', () => deepEqual(s(':has(#foo, .bar, baz)'), { a: 1, b: 0, c: 0 }));
    });

    describe(':nth-child()', () => {
        it('p:nth-child(2n+1)', () => deepEqual(s('p:nth-child(2n+1)'), { a: 0, b: 1, c: 1 }));
        it(':nth-child(2n+1 of .foo)', () => deepEqual(s(':nth-child(2n+1 of .foo)'), { a: 0, b: 2, c: 0 }));
        it(':nth-child(2n+1 of .foo, #bar)', () => deepEqual(s(':nth-child(2n+1 of .foo, #bar)'), { a: 1, b: 1, c: 0 }));
    });

    describe('Selector list', () => {
        it('foo, .bar', () => {
            const results = calc('foo, .bar');
            deepEqual(results, [
                { a: 0, b: 0, c: 1 },
                { a: 0, b: 1, c: 0 },
            ]);
        });
    });

    describe(':host()', () => {
        it(':host', () => deepEqual(s(':host'), { a: 0, b: 1, c: 0 }));
        it(':host(.foo)', () => deepEqual(s(':host(.foo)'), { a: 0, b: 2, c: 0 }));
    });
});
