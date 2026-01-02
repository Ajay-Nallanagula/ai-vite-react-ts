import React, { useState } from "react";
import { Select } from "./components/Select";
import type { SelectOption } from "./components/Select";
import "./App.css";

const options: SelectOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

function App() {
  const [value, setValue] = useState("");
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 24 }}>Custom Select Demo</h2>
      <Select
        options={options}
        value={value}
        onChange={setValue}
        placeholder="Select an option"
      />
      <div style={{ color: "#fff", marginTop: 24 }}>
        Selected: {value || "None"}
      </div>
    </div>
  );
}

export default App;
