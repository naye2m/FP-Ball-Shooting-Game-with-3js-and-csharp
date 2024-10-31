import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./setting.css";
console.log("running");

const defaultSettings = {
  fullscreen: false,
  resolution: "1920x1080",
};

const SettingsPopup = () => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle input changes and update settings
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: updatedValue,
    }));
  };

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Reset settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("settings");
  };

  // Group settings dynamically
  const createInput = (
    id,
    name,
    type = "text",
    defaultValue = "",
    placeholder = "",
    onChange,
    validator = e => Boolean(e),
  ) => (
    <div className="setting-option" key={id}>
      <label htmlFor={id}>{name}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={settings[id] || defaultValue}
        placeholder={placeholder}
        checked={type === "checkbox" ? settings[id] : undefined}
        onChange={e => {validator(e.target.value) && onChange()}}
      />
    </div>
  );

  // The popup UI rendered with a portal
  const popupUI = showPopup ? (
    <div id="settings-popup-window" className="settings-popup">
      <div className="popup-content">
        <h2>Settings</h2>

        {/* Graphics Group */}
        <fieldset className="settings-group">
          <legend>Graphics Settings</legend>
          {createInput(
            "fullscreen",
            "Enable Fullscreen",
            "checkbox",
            "",
            "",
            handleChange
          )}
          {createInput(
            "resolution",
            "Screen Resolution",
            "text",
            "1920x1080",
            "Enter resolution",
            handleChange
          )}
        </fieldset>

        {/* Add more groups and settings dynamically here */}

        <button onClick={resetSettings} className="reset-btn">
          Reset Settings
        </button>
        <button onClick={() => setShowPopup(false)} className="close-popup-btn">
          Close
        </button>
      </div>
    </div>
  ) : null;

  // The button to toggle the popup
  console.log(popupUI);
  return (
    <div id="settingdiv">
      <button onClick={() => setShowPopup(!showPopup)} className="settings-btn">
        Open Settings
      </button>

      {/* Use React Portal to append popup to the body */}
      {ReactDOM.createPortal(popupUI, document.body)}
    </div>
  );
};

// Render the popup
// createing root
window.addEventListener("DOMContentLoaded", () => {
  // create root element for the popup
  const settingdivcon = document.createElement("div");
  settingdivcon.id = "settingdivcon";
  document.body.appendChild(settingdivcon);
  ReactDOM.render(<SettingsPopup />, document.getElementById("settingdivcon"));
  console.log(settingdivcon);
  
});

export default SettingsPopup;
