import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { css } from '@emotion/react';
import ArrowIcon from '../assets/figma/select-dropdown-arrow.svg';

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

const selectContainer = css`
  width: 239px;
  position: relative;
  font-family: Inter, Arial, sans-serif;
`;

const selectBox = (open: boolean, disabled: boolean) => css`
  background: #000;
  color: #fff;
  border-radius: 8px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  border: 2px solid ${open ? '#fff' : 'transparent'};
  transition: border 0.2s;
  opacity: ${disabled ? 0.6 : 1};
`;

const dropdown = css`
  position: absolute;
  top: 60px;
  left: 0;
  width: 239px;
  background: #000;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 10;
  padding: 8px 0;
`;

const optionStyle = (selected: boolean) => css`
  padding: 12px 20px;
  color: #fff;
  background: ${selected ? 'rgba(255,255,255,0.08)' : 'transparent'};
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: rgba(255,255,255,0.15);
  }
`;

const arrowIconStyle = (open: boolean) => css`
  width: 14px;
  height: 22px;
  margin-left: 12px;
  transition: transform 0.2s;
  transform: rotate(${open ? 180 : 0}deg);
  filter: invert(1);
`;

export const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Select...', disabled = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Box css={selectContainer} ref={ref}>
      <Box
        css={selectBox(open, disabled)}
        onClick={() => !disabled && setOpen(o => !o)}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
      >
        <Typography variant="body1" sx={{ color: '#fff', fontSize: 14, fontWeight: 400 }}>
          {selectedOption ? selectedOption.label : <span style={{ color: '#aaa' }}>{placeholder}</span>}
        </Typography>
        <img src={ArrowIcon} alt="dropdown arrow" css={arrowIconStyle(open)} />
      </Box>
      {open && !disabled && (
        <Box css={dropdown} role="listbox">
          {options.map(opt => (
            <Box
              key={opt.value}
              css={optionStyle(opt.value === value)}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};