import React, { useState } from "react";
import "./styles.css";

const App = () => {
  const [devices, setDevices] = useState([]);

  // Function to add a new device
  const addDevice = () => {
    const newDeviceId = devices.length + 1;
    const newPort = `Port-${Math.floor(Math.random() * 100)}`; // Unique port for each device
    setDevices([...devices, { id: newDeviceId, port: newPort, message: "" }]); // Each device has its own message
  };

  // Function to detect radio model and type based on detection type
  const detectRadio = (deviceId, detectionType, manualModel) => {
    let radioModel, radioType;
    if (detectionType === "auto") {
      radioModel = `AutoDetect-${Math.floor(Math.random() * 1000)}`; // Auto-detect model
      radioType = ["VHF", "UHF", "HF"][Math.floor(Math.random() * 3)];
    } else {
      radioModel = manualModel;
      radioType = "Manual Entry";
    }

    // Update the specific device with the detected radio information and message
    const updatedDevices = devices.map((device) =>
      device.id === deviceId
        ? {
            ...device,
            radioModel,
            radioType,
            showRadioInfo: true,
            showEditSection: true,
            message: `Device ${deviceId} (Port: ${device.port}): Radio ${radioModel} detected and ready for programming.`,
          }
        : device
    );
    setDevices(updatedDevices);
  };

  // Function to update the display content for a device
  const updateRadioDisplay = (deviceId, displayText) => {
    const updatedDevices = devices.map((device) =>
      device.id === deviceId
        ? {
            ...device,
            message: `Device ${deviceId} (Port: ${device.port}): Display updated for ${device.radioModel}: "${displayText}"`,
          }
        : device
    );
    setDevices(updatedDevices);
  };

  // Function to upload an audio file for a device
  const uploadAudio = (deviceId, audioFile) => {
    const updatedDevices = devices.map((device) =>
      device.id === deviceId
        ? {
            ...device,
            message: audioFile
              ? `Device ${deviceId} (Port: ${device.port}): Audio file "${audioFile.name}" uploaded for ${device.radioModel}.`
              : `Device ${deviceId} (Port: ${device.port}): Please select an audio file first.`,
          }
        : device
    );
    setDevices(updatedDevices);
  };

  // Function to handle radio detection type change
  const handleDetectionTypeChange = (deviceId, detectionType) => {
    const updatedDevices = devices.map((device) =>
      device.id === deviceId ? { ...device, detectionType } : device
    );
    setDevices(updatedDevices);
  };

  return (
    <div className="container">
      <h1>Universal One Radio - Admin</h1>

      <button onClick={addDevice}>Add Another Device</button>

      <div id="devices">
        {devices.map((device) => (
          <div key={device.id} className="device" id={`device${device.id}`}>
            <h2>
              Device {device.id} (Connected to {device.port})
            </h2>
            <div className="detectionMethod">
              <h3>Radio Detection</h3>
              <select
                className="detectionType"
                onChange={(e) =>
                  handleDetectionTypeChange(device.id, e.target.value)
                }
              >
                <option value="auto">Auto-detect</option>
                <option value="manual">Manual Entry</option>
              </select>
              {device.detectionType === "manual" && (
                <input
                  type="text"
                  className="manualModel"
                  placeholder="Enter radio model manually"
                  value={device.manualModel || ""}
                  onChange={(e) => {
                    const updatedDevices = devices.map((d) =>
                      d.id === device.id
                        ? { ...d, manualModel: e.target.value }
                        : d
                    );
                    setDevices(updatedDevices);
                  }}
                />
              )}
              <button
                onClick={() =>
                  detectRadio(
                    device.id,
                    device.detectionType,
                    device.manualModel
                  )
                }
              >
                Detect/Enter Radio
              </button>
            </div>

            {device.showRadioInfo && (
              <div className="radioInfo">
                <h3>Radio Information</h3>
                <p>
                  Model: <span className="radioModel">{device.radioModel}</span>
                </p>
                <p>
                  Type: <span className="radioType">{device.radioType}</span>
                </p>
              </div>
            )}

            {device.showEditSection && (
              <div className="editSection">
                <h3>Edit Radio Display</h3>
                <input
                  type="text"
                  className="displayText"
                  placeholder="Enter text to display on radio"
                  value={device.displayText || ""}
                  onChange={(e) => {
                    const updatedDevices = devices.map((d) =>
                      d.id === device.id
                        ? { ...d, displayText: e.target.value }
                        : d
                    );
                    setDevices(updatedDevices);
                  }}
                />
                <button
                  onClick={() =>
                    updateRadioDisplay(device.id, device.displayText)
                  }
                >
                  Update Display
                </button>

                <h3>Upload Audio File</h3>
                <input
                  type="file"
                  className="audioFile"
                  accept="audio/*"
                  onChange={(e) => {
                    const updatedDevices = devices.map((d) =>
                      d.id === device.id
                        ? { ...d, audioFile: e.target.files[0] }
                        : d
                    );
                    setDevices(updatedDevices);
                  }}
                />
                <button
                  onClick={() => uploadAudio(device.id, device.audioFile)}
                >
                  Upload Audio
                </button>
              </div>
            )}

            {/* Display device-specific message */}
            {device.message && <div className="message">{device.message}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
