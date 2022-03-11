// Types & Classes
export type SpecificityArray = [number, number, number];
export type SpecificityObject = { a: number; b: number; c: number };

export class Specificity {
    constructor(value: SpecificityObject, selector?: any);
    value: SpecificityObject;
    selector: string | Object;
    set a(arg: number);
    get a(): number;
    set b(arg: number);
    get b(): number;
    set c(arg: number);
    get c(): number;
    selectorString(): string;
    toObject(): SpecificityObject;
    toArray(): SpecificityArray;
    toString(): string;
    toJSON(): {
        selector: string;
        asObject: SpecificityObject;
        asArray: SpecificityArray;
        asString: string;
    };
    equals(otherSpecificity: SpecificityInstanceOrObject): boolean;
    isGreaterThan(otherSpecificity: SpecificityInstanceOrObject): boolean;
    isLessThan(otherSpecificity: SpecificityInstanceOrObject): boolean;
}

type SpecificityInstanceOrObject = Specificity | SpecificityObject;

// CORE
export function calculate(selector: string): Array<Specificity>; // @TODO: A CSSTree AST is also accepted …

// UTIL: COMPARE
export function equals(s1: SpecificityInstanceOrObject, s2: SpecificityInstanceOrObject): boolean;
export function greaterThan(s1: SpecificityInstanceOrObject, s2: SpecificityInstanceOrObject): boolean;
export function lessThan(s1: SpecificityInstanceOrObject, s2: SpecificityInstanceOrObject): boolean;
export function compare(s1: SpecificityInstanceOrObject, s2: SpecificityInstanceOrObject): number;

// UTIL: FILTER
export function min(specificities: Array<SpecificityInstanceOrObject>): SpecificityInstanceOrObject;
export function max(specificities: Array<SpecificityInstanceOrObject>): SpecificityInstanceOrObject;

// UTIL: SORT
export function ascending(specificities: Array<SpecificityInstanceOrObject>): Array<SpecificityInstanceOrObject>;
export function descending(specificities: Array<SpecificityInstanceOrObject>): Array<SpecificityInstanceOrObject>;
export function sort(specificities: Array<SpecificityInstanceOrObject>, order?: 'ASC' | 'DESC'): Array<SpecificityInstanceOrObject>;
