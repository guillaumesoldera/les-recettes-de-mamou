exports.groupBy = (xs, key) => {
    return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

exports.equalsIgnoreCase = (string1, string2) => {
    return string1.localeCompare(string2, undefined, { sensitivity: 'accent' }) === 0
}