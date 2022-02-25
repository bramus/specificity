import { equal, deepEqual } from 'assert';
import parse from 'css-tree/parser';
import { calculate } from '../src/index.js';

describe('Specificity Class', () => {
    const s = calculate('#foo.bar.baz a b c')[0];

    describe('Instance Getters', () => {
        it('Specificity.value', () => {
            deepEqual(s.value, { a: 1, b: 2, c: 3 });
        });
        it('Specificity.a', () => {
            deepEqual(s.a, 1);
        });
        it('Specificity.b', () => {
            deepEqual(s.b, 2);
        });
        it('Specificity.c', () => {
            deepEqual(s.c, 3);
        });
    });
    describe('Value Formatting', () => {
        it('Specificity.toString()', () => {
            deepEqual(s.toString(), '(1,2,3)');
        });
        it('Specificity.toArray()', () => {
            deepEqual(s.toArray(), [1, 2, 3]);
        });
        it('Specificity.toObject()', () => {
            deepEqual(s.toObject(), { a: 1, b: 2, c: 3 });
        });
        it('Specificity.selectorString()', () => {
            deepEqual(s.selectorString(), '#foo.bar.baz a b c');
        });
        it('JSON.stringify(Specificity)', () => {
            deepEqual(JSON.parse(JSON.stringify(s)), {
                selector: '#foo.bar.baz a b c',
                asObject: { a: 1, b: 2, c: 3 },
                asArray: [1, 2, 3],
                asString: '(1,2,3)',
            });
        });
    });
    describe('Instance Comparison Methods', () => {
        const sHigh = calculate('#foo#bar.baz a b c')[0];
        const sLow = calculate('#foo.baz a b c')[0];

        it('Specificity.isGreaterThan()', () => {
            deepEqual(s.isGreaterThan(s), false);
            deepEqual(s.isGreaterThan(sHigh), false);
            deepEqual(s.isGreaterThan(sLow), true);
        });
        it('Specificity.isLessThan()', () => {
            deepEqual(s.isLessThan(s), false);
            deepEqual(s.isLessThan(sHigh), true);
            deepEqual(s.isLessThan(sLow), false);
        });
        it('Specificity.equals()', () => {
            deepEqual(s.equals(s), true);
            deepEqual(s.equals(sHigh), false);
            deepEqual(s.equals(sLow), false);
        });
    });
});
