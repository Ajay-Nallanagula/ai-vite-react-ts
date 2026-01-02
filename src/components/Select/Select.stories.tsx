import React, { useState } from "react";
import { Select } from "./Select";
import type { SelectOption } from "./Select";

export default {
  title: "Components/Select",
  component: Select,
};

const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

export const Default = () => {
  const [value, setValue] = useState("");
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Select an option"
    />
  );
};

export const Disabled = () => {
  const [value, setValue] = useState("");
  return (
    <Select
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Disabled select"
      disabled
    />
  );
};
