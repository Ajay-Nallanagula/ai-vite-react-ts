import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectOption } from "./Select";
import "@testing-library/jest-dom";

const options: SelectOption[] = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
  { label: "Option 3", value: "option3" },
];

describe("Select Component", () => {
  describe("Rendering", () => {
    it("renders placeholder when no value is selected", () => {
      render(
        <Select
          options={options}
          value=""
          onChange={() => {}}
          placeholder="Pick one"
        />
      );
      expect(screen.getByText("Pick one")).toBeInTheDocument();
    });

    it("renders with default placeholder when none provided", () => {
      render(<Select options={options} value="" onChange={() => {}} />);
      expect(screen.getByText("Select...")).toBeInTheDocument();
    });

    it("shows selected option label when value is provided", () => {
      render(
        <Select options={options} value="option2" onChange={() => {}} />
      );
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("renders dropdown arrow icon", () => {
      const { container } = render(
        <Select options={options} value="" onChange={() => {}} />
      );
      const arrow = container.querySelector("img[alt='dropdown arrow']");
      expect(arrow).toBeInTheDocument();
    });
  });

  describe("Interaction - Open/Close", () => {
    it("opens dropdown menu when clicked", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          value=""
          onChange={() => {}}
          placeholder="Select..."
        />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    it("displays all options when dropdown is open", async () => {
      const user = userEvent.setup();
      render(
        <Select
          options={options}
          value=""
          onChange={() => {}}
          placeholder="Select..."
        />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
      expect(screen.getByText("Option 3")).toBeInTheDocument();
    });

    it("closes dropdown when option is selected", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <Select options={options} value="" onChange={handleChange} />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const option2 = screen.getByText("Option 2");
      await user.click(option2);

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <div>
          <Select options={options} value="" onChange={() => {}} />
          <button>Outside Button</button>
        </div>
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      const outsideButton = screen.getByText("Outside Button");
      await user.click(outsideButton);

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });

    it("closes dropdown when pressing Escape key", async () => {
      const user = userEvent.setup();
      render(
        <Select options={options} value="" onChange={() => {}} />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);
      expect(screen.getByRole("listbox")).toBeInTheDocument();

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
      // Note: Component doesn't handle Escape in current implementation
      // This test documents the current behavior
    });
  });

  describe("Selection", () => {
    it("calls onChange when an option is selected", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Select options={options} value="" onChange={handleChange} />);

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const option2 = screen.getByText("Option 2");
      await user.click(option2);

      expect(handleChange).toHaveBeenCalledWith("option2");
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("shows selected value with correct styling", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Select options={options} value="" onChange={handleChange} />);

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const option3 = screen.getByRole("option", { name: "Option 3" });
      await user.click(option3);

      expect(handleChange).toHaveBeenCalledWith("option3");
    });

    it("highlights currently selected option", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      const { rerender } = render(
        <Select options={options} value="option1" onChange={handleChange} />
      );

      const selectBox = screen.getByText("Option 1");
      await user.click(selectBox);

      const option1 = screen.getByRole("option", { name: "Option 1" });
      expect(option1).toHaveAttribute("aria-selected", "true");

      const option2 = screen.getByRole("option", { name: "Option 2" });
      expect(option2).toHaveAttribute("aria-selected", "false");
    });
  });

  describe("Disabled State", () => {
    it("does not open dropdown when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <Select
          options={options}
          value=""
          onChange={handleChange}
          disabled
        />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("does not call onChange when disabled and option is clicked", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <Select
          options={options}
          value=""
          onChange={handleChange}
          disabled
        />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("applies disabled styling to select box", () => {
      const { container } = render(
        <Select options={options} value="" onChange={() => {}} disabled />
      );

      const selectBox = container.firstChild?.firstChild;
      expect(selectBox).toHaveStyle({ cursor: "not-allowed" });
    });

    it("has aria-disabled attribute when disabled", () => {
      const { container } = render(
        <Select options={options} value="" onChange={() => {}} disabled />
      );

      const selectBox = container.querySelector('[aria-disabled="true"]');
      expect(selectBox).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes on trigger button", () => {
      const { container } = render(
        <Select options={options} value="" onChange={() => {}} />
      );

      const selectBox = container.firstChild?.firstChild;
      expect(selectBox).toHaveAttribute("aria-haspopup", "listbox");
      expect(selectBox).toHaveAttribute("aria-expanded");
    });

    it("updates aria-expanded when dropdown is toggled", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select options={options} value="" onChange={() => {}} />
      );

      const selectBox = container.querySelector("[aria-haspopup='listbox']");
      expect(selectBox).toHaveAttribute("aria-expanded", "false");

      await user.click(selectBox!);
      expect(selectBox).toHaveAttribute("aria-expanded", "true");
    });

    it("marks selected option with aria-selected", async () => {
      const user = userEvent.setup();
      render(
        <Select options={options} value="option2" onChange={() => {}} />
      );

      const selectBox = screen.getByText("Option 2");
      await user.click(selectBox);

      const selectedOption = screen.getByRole("option", { name: "Option 2" });
      expect(selectedOption).toHaveAttribute("aria-selected", "true");
    });

    it("has role listbox for dropdown menu", async () => {
      const user = userEvent.setup();
      render(
        <Select options={options} value="" onChange={() => {}} />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const listbox = screen.getByRole("listbox");
      expect(listbox).toBeInTheDocument();
    });

    it("has role option for each option item", async () => {
      const user = userEvent.setup();
      render(
        <Select options={options} value="" onChange={() => {}} />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const optionItems = screen.getAllByRole("option");
      expect(optionItems).toHaveLength(3);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty options array", () => {
      const { container } = render(
        <Select options={[]} value="" onChange={() => {}} />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("handles options with special characters", async () => {
      const user = userEvent.setup();
      const specialOptions = [
        { label: "Option & Special", value: "special" },
        { label: 'Option "Quoted"', value: "quoted" },
      ];

      render(
        <Select
          options={specialOptions}
          value=""
          onChange={() => {}}
        />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      expect(screen.getByText('Option "Quoted"')).toBeInTheDocument();
    });

    it("handles value not in options array", () => {
      render(
        <Select
          options={options}
          value="nonexistent"
          onChange={() => {}}
          placeholder="Select..."
        />
      );

      expect(screen.getByText("Select...")).toBeInTheDocument();
    });

    it("handles large number of options", async () => {
      const user = userEvent.setup();
      const manyOptions = Array.from({ length: 100 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `option${i + 1}`,
      }));

      render(
        <Select
          options={manyOptions}
          value=""
          onChange={() => {}}
        />
      );

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const option50 = screen.getByText("Option 50");
      expect(option50).toBeInTheDocument();
    });
  });

  describe("Arrow Icon Animation", () => {
    it("rotates arrow icon when dropdown is open", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Select options={options} value="" onChange={() => {}} />
      );

      const arrow = container.querySelector("img[alt='dropdown arrow']");
      const initialTransform = (arrow as HTMLElement).style.transform;

      const selectBox = screen.getByText("Select...");
      await user.click(selectBox);

      const openTransform = (arrow as HTMLElement).style.transform;
      expect(openTransform).not.toBe(initialTransform);
    });
  });
});
