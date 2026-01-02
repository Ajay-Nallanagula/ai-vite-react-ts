import React, { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";

// Handle SVG import for both Jest and Storybook
let ArrowIcon: string;
try {
  // Try ES module import first (for Storybook/browser)
  // @ts-ignore
  ArrowIcon = require("../../assets/figma/select-dropdown-arrow.svg");
} catch {
  // Fallback for browser environments
  ArrowIcon = "";
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Box
      ref={ref}
      sx={{
        width: 239,
        position: "relative",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <Box
        onClick={() => !disabled && setOpen((o) => !o)}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        sx={{
          background: "#000",
          color: "#fff",
          borderRadius: 2,
          height: 54,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          cursor: disabled ? "not-allowed" : "pointer",
          border: open ? "2px solid #fff" : "2px solid transparent",
          transition: "border 0.2s",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: "#fff", fontSize: 14, fontWeight: 400 }}
        >
          {selectedOption ? (
            selectedOption.label
          ) : (
            <span style={{ color: "#aaa" }}>{placeholder}</span>
          )}
        </Typography>
        <img
          src={ArrowIcon}
          alt="dropdown arrow"
          style={{
            width: 14,
            height: 22,
            marginLeft: 12,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            filter: "invert(1)",
          }}
        />
      </Box>
      {open && !disabled && (
        <Box
          role="listbox"
          sx={{
            position: "absolute",
            top: 60,
            left: 0,
            width: 239,
            background: "#000",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            zIndex: 10,
            py: 1,
          }}
        >
          {options.map((opt) => (
            <Box
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={opt.value === value}
              sx={{
                px: 2.5,
                py: 1.5,
                color: "#fff",
                background:
                  opt.value === value
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
                cursor: "pointer",
                fontSize: 14,
                "&:hover": {
                  background: "rgba(255,255,255,0.15)",
                },
              }}
            >
              {opt.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
