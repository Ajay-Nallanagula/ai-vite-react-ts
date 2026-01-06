import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import type { SelectOption, SelectProps } from "./Select";

/**
 * # Select Component
 *
 * A fully accessible dropdown select component built with React and Material-UI.
 *
 * ## Features
 * - **Keyboard Navigation**: Fully keyboard accessible with ARIA attributes
 * - **Dropdown Menu**: Click to toggle the options menu
 * - **Disabled State**: Can be disabled to prevent interaction
 * - **Custom Options**: Accepts an array of label-value pairs
 * - **Controlled Component**: Manages state through props
 *
 * ## Usage
 * ```tsx
 * import { Select, SelectOption } from './components/Select';
 *
 * const options: SelectOption[] = [
 *   { label: "Option 1", value: "option1" },
 *   { label: "Option 2", value: "option2" },
 *   { label: "Option 3", value: "option3" },
 * ];
 *
 * export function MyComponent() {
 *   const [selected, setSelected] = useState("");
 *   return (
 *     <Select
 *       options={options}
 *       value={selected}
 *       onChange={setSelected}
 *       placeholder="Choose an option"
 *     />
 *   );
 * }
 * ```
 *
 * ## Props
 * - `options` (required): Array of SelectOption objects with `label` and `value`
 * - `value` (required): Currently selected value
 * - `onChange` (required): Callback function when selection changes
 * - `placeholder` (optional): Text shown when no value is selected (default: "Select...")
 * - `disabled` (optional): Whether the select is disabled (default: false)
 *
 * ## Accessibility
 * The component includes:
 * - ARIA attributes (`aria-haspopup`, `aria-expanded`, `aria-disabled`)
 * - Role attributes for semantic HTML
 * - Keyboard interaction support
 * - Focus management
 */
const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A dropdown select component with keyboard navigation and accessibility features",
      },
    },
  },
  argTypes: {
    options: {
      description: "Array of options with label and value",
      control: { type: "object" },
    },
    value: {
      description: "Currently selected value",
      control: { type: "text" },
    },
    onChange: {
      description: "Callback function triggered when selection changes",
      action: "changed",
    },
    placeholder: {
      description: "Placeholder text when no value is selected",
      control: { type: "text" },
    },
    disabled: {
      description: "Whether the select component is disabled",
      control: { type: "boolean" },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions: SelectOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
  { label: "Option 4", value: "option4" },
  { label: "Option 5", value: "option5" },
];

/**
 * Default Select component with initial state
 */
export const Default: Story = {
  args: {
    options: defaultOptions,
    value: "",
    placeholder: "Select an option",
    disabled: false,
  },
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};

/**
 * Select component with a pre-selected value
 */
export const WithSelectedValue: Story = {
  args: {
    options: defaultOptions,
    value: "option2",
    placeholder: "Select an option",
    disabled: false,
  },
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};

/**
 * Disabled Select component - cannot be interacted with
 */
export const Disabled: Story = {
  args: {
    options: defaultOptions,
    value: "",
    placeholder: "Disabled select",
    disabled: true,
  },
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};

/**
 * Disabled Select with pre-selected value
 */
export const DisabledWithValue: Story = {
  args: {
    options: defaultOptions,
    value: "option3",
    placeholder: "Select an option",
    disabled: true,
  },
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};

/**
 * Select component with custom placeholder
 */
export const CustomPlaceholder: Story = {
  args: {
    options: defaultOptions,
    value: "",
    placeholder: "Choose your preference...",
    disabled: false,
  },
  render: function Render(args: SelectProps) {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
          args.onChange(newValue);
        }}
      />
    );
  },
};
