import { ascending, descending } from './sort.js';

const max = (specificities) => {
    const sorted = descending(specificities);
    return sorted[0];
};

const min = (specificities) => {
    const sorted = ascending(specificities);
    return sorted[0];
};

export { max, min };
