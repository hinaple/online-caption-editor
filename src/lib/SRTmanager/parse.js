import Caption from "../caption.js";

export default content => {
    const trimCont = content.replace(/\r\n/g, '\n').trim();
    const splitted = trimCont.split(/\n\s*\n/);
    const captions = splitted.map(cap => Caption.parse(cap));
    return captions;
}