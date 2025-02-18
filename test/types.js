import { deepEqual, throws } from 'assert';
import Specificity from '../dist/index.js';

describe('Specificity Class, manual instance', () => {
    const s = new Specificity({ a: 1, b: 2, c: 3 }, '#foo.bar.baz a b c');

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
    describe('Instance Setters', () => {
        it('Specificity.a', () => {
            throws(
                () => {
                    s.a = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
        });
        it('Specificity.b', () => {
            throws(
                () => {
                    s.b = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
        });
        it('Specificity.c', () => {
            throws(
                () => {
                    s.c = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
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
});

describe('Specificity Class, manual instance, no given selector', () => {
    const s = new Specificity({ a: 1, b: 2, c: 3 });

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
    describe('Instance Setters', () => {
        it('Specificity.a', () => {
            throws(
                () => {
                    s.a = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
        });
        it('Specificity.b', () => {
            throws(
                () => {
                    s.b = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
        });
        it('Specificity.c', () => {
            throws(
                () => {
                    s.c = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
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
            deepEqual(s.selectorString(), '');
        });
        it('JSON.stringify(Specificity)', () => {
            deepEqual(JSON.parse(JSON.stringify(s)), {
                selector: '',
                asObject: { a: 1, b: 2, c: 3 },
                asArray: [1, 2, 3],
                asString: '(1,2,3)',
            });
        });
    });
});

describe('Specificity Class', () => {
    const s = Specificity.calculate('#foo.bar.baz a b c')[0];

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
    describe('Instance Setters', () => {
        it('Specificity.a', () => {
            throws(
                () => {
                    s.a = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
        });
        it('Specificity.b', () => {
            throws(
                () => {
                    s.b = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
        });
        it('Specificity.c', () => {
            throws(
                () => {
                    s.c = 1;
                },
                {
                    message: 'Manipulating a Specificity instance is not allowed. Instead, create a new Specificity()',
                },
            );
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
        const sHigh = Specificity.calculate('#foo#bar.baz a b c')[0];
        const sLow = Specificity.calculate('#foo.baz a b c')[0];

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
        it('Specificity.isEqualTo()', () => {
            deepEqual(s.isEqualTo(s), true);
            deepEqual(s.isEqualTo(sHigh), false);
            deepEqual(s.isEqualTo(sLow), false);
        });
    });

    describe('Static Instance Methods', () => {
        const sHigh = Specificity.calculate('#foo#bar.baz a b c')[0];
        const sLow = Specificity.calculate('#foo.baz a b c')[0];

        it('Specificity.min', () => {
            deepEqual(Specificity.min(sHigh, sLow), sLow);
        });
        it('Specificity.max', () => {
            deepEqual(Specificity.max(sHigh, sLow), sHigh);
        });
    });
});
