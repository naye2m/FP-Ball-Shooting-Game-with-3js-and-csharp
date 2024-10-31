// import {dat} from './games_fps.copy.js'
console.log("running");
// todo auto fullscreen, automouseLock, uiBTNs,btnPlaceMent
// alert()
class localSettings {
    constructor(props) {
        for (const key in props) {
            if (this[key] !== undefined) {
                if (typeof this[key] === "object" && !Array.isArray(this[key]))
                    this[key] = Object.assign(this[key], props[key])
                else
                    this[key] = props[key];
            } else {
                console.error(key, "is not a valid proparty of SettingElem Class")
            }
        }
    }
    name = null;
    title = null;
    defaultValue = null;
    value = null;
    varPathStr = "";
    htmlInputOptions = {
        type: "text",
        name: "",
        id: "",
    };
    /* 
    _hello = "hello";
    get hello() {
    console.log("req to get Hello")
    return `<${this._hello}>`
    }
    set hello(val) {
    console.log("req to set Hello", "value was", val)
    return this._hello = val
    }
    */
    get getLocalStorageSettings() {
        return JSON.parse(localStorage.getItem("setting"))
    };
    getValueTypeFromName(name) {
        return name.split(".").at(-1)
    }
    promptFor(name) {
        type = this.getValueTypeFromName(name);
        switch (type) {
            case 'string':
            // typeof "sdfs"
            case 'boolean':
            // typeof true
            case 'number':
            // typeof 5
            case 'object':
            // typeof {}
            // typeof []
            case 'function':
                throw "function type not accepted"
        }
    }
    get settings() {
        return JSON.parse(localStorage.getItem("setting")) || {};
    }
    set settings(val) {
        const currentSettings = this.settings;
        const updatedSettings = { ...currentSettings, ...val };
        localStorage.setItem("setting", JSON.stringify(updatedSettings));
    }
    htmlInputFuild(options) {
    }
}
// window.dat.localSettings = new localSettings();
function createTextInput(id, name, defaultValue = "", placeholder = "", elemClass = []) {
    const elem = document.createElement("input");
    elem.type = "text";
    elem.id = id;
    elem.name = name;
    elem.value = defaultValue;
    elem.placeholder = placeholder;
    elemClass.forEach(cls => elem.classList.add(cls));
    return elem;
}
function localSettingsUpdate() {
    if (!localStorage.getItem("setting")) {
        console.log("No settings are saved on LocalStorage");
    }
}
export { localSettings, localSettingsUpdate };