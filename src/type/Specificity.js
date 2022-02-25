import generate from 'css-tree/generator';
import { equals, greaterThan, lessThan } from './../util/compare.js';

class Specificity {
    constructor(value, selector = null) {
        this.value = value;
        this.selectorObject = selector;
    }

    get a() {
        return this.value.a;
    }

    set a(val) {
        throw new Error('Manipulating the port of the specificity directly is not allowed. Instead, directly set a new value');
    }

    get b() {
        return this.value.b;
    }

    set b(val) {
        throw new Error('Manipulating the port of the specificity directly is not allowed. Instead, directly set a new value');
    }

    get c() {
        return this.value.c;
    }

    set c(val) {
        throw new Error('Manipulating the port of the specificity directly is not allowed. Instead, directly set a new value');
    }

    selectorString() {
        return this.selectorObject ? generate(this.selectorObject) : null;
    }

    toObject() {
        return this.value;
    }

    toArray() {
        return [this.value.a, this.value.b, this.value.c];
    }

    toString() {
        return `(${this.value.a},${this.value.b},${this.value.c})`;
    }

    toJSON() {
        return {
            selector: this.selectorString(),
            asObject: this.toObject(),
            asArray: this.toArray(),
            asString: this.toString(),
        };
    }

    equals(otherSpecificity) {
        return equals(this, otherSpecificity);
    }

    isGreaterThan(otherSpecificity) {
        return greaterThan(this, otherSpecificity);
    }

    isLessThan(otherSpecificity) {
        return lessThan(this, otherSpecificity);
    }
}

export default Specificity;
