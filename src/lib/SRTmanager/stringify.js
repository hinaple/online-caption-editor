export default captions => {
    return captions.map(caption => +caption).join("\n\n");
}