import React, { useState } from "react";
import { sendVibration } from "../lib/bluetooth";

const TrainPage1: React.FC = () => {
  // Motor intensities: 0–255
  const [orange, setOrange] = useState(0);
  const [yellow, setYellow] = useState(0);
  const [green, setGreen] = useState(0);
  const [purple, setPurple] = useState(0);

  // Duration in ms
  const [duration, setDuration] = useState(500);

  const [status, setStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSendVibration() {
    const pattern = [
      orange,
      yellow,
      green,
      purple,
      duration
    ];

    try {
      setIsSending(true);
      setStatus(null);

      await sendVibration(pattern);

      setStatus("Vibration sent successfully.");
    } catch (err) {
      console.error(err);
      setStatus(
        "LinguaVibe service not running.\nPlease start the desktop service."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h2>LinguaVibe – Training</h2>

      <MotorSlider
        label="Orange Motor"
        value={orange}
        onChange={setOrange}
      />
      <MotorSlider
        label="Yellow Motor"
        value={yellow}
        onChange={setYellow}
      />
      <MotorSlider
        label="Green Motor"
        value={green}
        onChange={setGreen}
      />
      <MotorSlider
        label="Purple Motor"
        value={purple}
        onChange={setPurple}
      />

      <div style={{ marginTop: 16 }}>
        <label>
          Duration (ms):
          <input
            type="number"
            min={50}
            max={5000}
            step={50}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 24 }}>
        <button
          onClick={handleSendVibration}
          disabled={isSending}
          style={{ padding: "8px 16px" }}
        >
          {isSending ? "Sending..." : "Play Vibration"}
        </button>
      </div>

      {status && (
        <div style={{ marginTop: 16, whiteSpace: "pre-line" }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default TrainPage1;

/* ---------------- Helper component ---------------- */

type MotorSliderProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

const MotorSlider: React.FC<MotorSliderProps> = ({
  label,
  value,
  onChange
}) => {
  return (
    <div style={{ marginTop: 12 }}>
      <label>
        {label}: {value}
      </label>
      <input
        type="range"
        min={0}
        max={255}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
};
