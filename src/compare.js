const compare = (s1, s2) => {
    if (s1.a === s2.a) {
        if (s1.b === s2.b) {
            return s2.c - s1.c;
        }
        return s2.b - s1.b;
    }
    return s2.a - s1.a;
};

const equals = (s1, s2) => {
    return compare(s1, s2) === 0;
};

const moreSpecificThan = (s1, s2) => {
    return compare(s1, s2) === -1;
};

const lessSpecificThan = (s1, s2) => {
    return compare(s1, s2) === 1;
};

export { equals, moreSpecificThan, lessSpecificThan };
export default compare;
