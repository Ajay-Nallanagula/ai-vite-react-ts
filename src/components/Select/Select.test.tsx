import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectOption } from "./Select";
import "@testing-library/jest-dom";

const options: SelectOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("Select", () => {
  it("renders placeholder when no value is selected", () => {
    const { getByText } = render(
      <Select
        options={options}
        value=""
        onChange={() => {}}
        placeholder="Pick one"
      />
    );
    expect(getByText("Pick one")).toBeInTheDocument();
  });

  it("shows options when clicked and selects an option", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { getByText, getByRole, queryByRole } = render(
      <Select options={options} value="" onChange={handleChange} />
    );
    const selectBox = getByText("Select...").parentElement;
    await user.click(selectBox!);
    expect(getByRole("listbox")).toBeInTheDocument();
    await user.click(getByText("Option 2"));
    expect(handleChange).toHaveBeenCalledWith("option2");
  });

  it("disables interaction when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { getByText, queryByRole } = render(
      <Select options={options} value="" onChange={handleChange} disabled />
    );
    const selectBox = getByText("Select...").parentElement;
    await user.click(selectBox!);
    expect(queryByRole("listbox")).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("shows selected value", () => {
    const { getByText } = render(
      <Select options={options} value="option3" onChange={() => {}} />
    );
    expect(getByText("Option 3")).toBeInTheDocument();
  });
});
