import compare from './compare.js';

const sort = (specificities, order = 'ASC') => {
    const sorted = specificities.sort(compare);

    if (order === 'DESC') {
        return sorted.reverse();
    }

    return sorted;
};

const ascending = (specificities) => {
    return sort(specificities, 'ASC');
};

const descending = (specificities) => {
    return sort(specificities, 'DESC');
};

export { ascending, descending };
export default sort;
