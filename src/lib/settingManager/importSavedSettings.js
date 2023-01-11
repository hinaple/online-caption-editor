import settings from "./settings.js";

export default rawSetting => {
    return settings.map(setting => {
        return {
            ...setting,
            value: rawSetting[setting.id] ?? null
        };
    });
}