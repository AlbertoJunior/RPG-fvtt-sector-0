const operators = {
    eq: (values) => values.every(v => v === values[0]),
    not: ([value]) => !value,
    lt: ([a, b]) => a < b,
    lte: ([a, b]) => a <= b,
    gt: ([a, b]) => a > b,
    gte: ([a, b]) => a >= b,
    isNull: ([value]) => value === null || value === undefined,
    isEmpty: (collection) => {
        if (!collection)
            return true;
        return collection.length == 0
    },
};

export default function operator(op, ...params) {
    params.pop();
    return operators[op](Object.values(params));
}