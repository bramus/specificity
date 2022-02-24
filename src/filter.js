import * as sort from './sort.js';

const highest = (specificities) => {
    const sorted = sort.descending(specificities);
    return sorted[0];
};

const lowest = (specificities) => {
    const sorted = sort.ascending(specificities);
    return sorted[0];
};

export { highest, lowest };
