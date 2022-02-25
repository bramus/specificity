import { ascending, descending } from './sort.js';

const highest = (specificities) => {
    const sorted = descending(specificities);
    return sorted[0];
};

const lowest = (specificities) => {
    const sorted = ascending(specificities);
    return sorted[0];
};

export { highest, lowest };
