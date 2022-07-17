export default fileName => {
    const splitted = fileName.split('.');
    return {
        extension: splitted[splitted.length - 1],
        rest: splitted.filter((s, index) => index < splitted.length - 1).join('.')
    };
}