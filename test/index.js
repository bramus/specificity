import { equal, deepEqual } from 'assert';
import { calculate } from '../src/index.js';

describe('Examples from the spec', () => {
    it('* = (0,0,0)', () => {
        deepEqual(calculate('*'), { a: 0, b: 0, c: 0 });
    });
    it('li = (0,0,1)', () => {
        deepEqual(calculate('li'), { a: 0, b: 0, c: 1 });
    });
    it('ul li = (0,0,2)', () => {
        deepEqual(calculate('ul li'), { a: 0, b: 0, c: 2 });
    });
    it('UL OL+LI  = (0,0,3)', () => {
        deepEqual(calculate('UL OL+LI '), { a: 0, b: 0, c: 3 });
    });
    it('H1 + *[REL=up] = (0,1,1)', () => {
        deepEqual(calculate('H1 + *[REL=up]'), { a: 0, b: 1, c: 1 });
    });
    it('UL OL LI.red = (0,1,3)', () => {
        deepEqual(calculate('UL OL LI.red'), { a: 0, b: 1, c: 3 });
    });
    it('LI.red.level = (0,2,1)', () => {
        deepEqual(calculate('LI.red.level'), { a: 0, b: 2, c: 1 });
    });
    it('#x34y = (1,0,0)', () => {
        deepEqual(calculate('#x34y'), { a: 1, b: 0, c: 0 });
    });
    it('#s12:not(FOO) = (1,0,1)', () => {
        deepEqual(calculate('#s12:not(FOO)'), { a: 1, b: 0, c: 1 });
    });
    it('.foo :is(.bar, #baz) = (1,1,0)', () => {
        deepEqual(calculate('.foo :is(.bar, #baz)'), { a: 1, b: 1, c: 0 });
    });
});

describe('Examples from Kilian', () => {
    it('header h1#sitetitle > .logo = (1,1,2)', () => {
        deepEqual(calculate('header h1#sitetitle > .logo'), { a: 1, b: 1, c: 2 });
    });
    it('ul > li:is(.highlighted, .active) = (0,1,2)', () => {
        deepEqual(calculate('ul > li:is(.highlighted, .active)'), { a: 0, b: 1, c: 2 });
    });
    it('header:where(#top) nav li:nth-child(2n + 1) = (0,1,3)', () => {
        deepEqual(calculate('header:where(#top) nav li:nth-child(2n + 1)'), { a: 0, b: 1, c: 3 });
    });
});

describe('Remixed examples from Kilian', () => {
    it('header:has(#top) nav li:nth-child(2n + 1) = (1,1,3)', () => {
        deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1)'), { a: 1, b: 1, c: 3 });
    });
    it('header:has(#top) nav li:nth-child(2n + 1 of .foo) = (1,2,3)', () => {
        deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo)'), { a: 1, b: 2, c: 3 });
    });
    it('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar) = (2,1,3)', () => {
        deepEqual(calculate('header:has(#top) nav li:nth-child(2n + 1 of .foo, #bar)'), { a: 2, b: 1, c: 3 });
    });
});
