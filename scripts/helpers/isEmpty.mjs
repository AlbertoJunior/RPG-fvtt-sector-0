export default function isEmpty(collection) {
    if (!collection)
        return true;
    return collection.length == 0;
}