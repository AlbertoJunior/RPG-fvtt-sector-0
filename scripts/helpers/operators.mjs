const operators = {
    eq: (values) => values.every(v => v === values[0]),
    not: ([value]) => !value,
    lt: ([a, b]) => a < b,
    lte: ([a, b]) => a <= b,
    gt: ([a, b]) => a > b,
    gte: ([a, b]) => a >= b,
    isNull: ([value]) => value === null || value === undefined,
    isNotNull: ([value]) => !operators['isNull']([value]),
    isEmpty: (collection) => Array.isArray(collection) && collection.length === 0,
    isNotEmpty: (collection) => Array.isArray(collection) && collection.length > 0,
    or: (values) => values.some(Boolean),
};

export default function operator(op, ...params) {
    params.pop();
    const input = params.length === 1 && Array.isArray(params[0])
        ? params[0]
        : params;

    return operators[op](input);
}