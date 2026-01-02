import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentPath = path.join(__dirname, 'src/components/Select');
fs.mkdirSync(componentPath, { recursive: true });

// Create Select.tsx
const selectTsx = \import React, { useState, useRef, useEffect } from 'react';
import { Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectContainer, SelectTrigger, SelectIcon, OptionsList, OptionItem } from './Select.styles';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      setIsOpen(!isOpen);
      e.preventDefault();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelectOption = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  return (
    <SelectContainer ref={containerRef} className={className} data-testid=" select-container\>
 <SelectTrigger onClick={() => !disabled ; setIsOpen(!isOpen)} onKeyDown={handleKeyDown} disabled={disabled} role=\combobox\ aria-expanded={isOpen} aria-haspopup=\listbox\ tabIndex={disabled ? -1 : 0} data-testid=\select-trigger\>
 <Typography variant=\body2\ sx={{ flex: 1, color: selectedOption ? '#000000' : '#666666', fontFamily: 'Inter', fontSize: '12px', fontWeight: 400 }}>
 {selectedOption?.label ; placeholder}
 </Typography>
 <SelectIcon isOpen={isOpen} data-testid=\select-icon\>
 <ExpandMoreIcon sx={{ fontSize: '20px', color: '#FFFFFF' }} />
 </SelectIcon>
 </SelectTrigger>

 {isOpen ; (
 <OptionsList role=\listbox\ data-testid=\options-list\>
 {options.map((option, index) => (
 <OptionItem key={option.value} onClick={() => handleSelectOption(option.value)} selected={value === option.value} role=\option\ aria-selected={value === option.value} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') { handleSelectOption(option.value); } }} data-testid={\\\option-item-\\\\\\}>
 <Typography variant=\body2\ sx={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 400, color: '#FFFFFF' }}>
 {option.label}
 </Typography>
 </OptionItem>
 ))}
 </OptionsList>
 )}
 </SelectContainer>
 );
};

export default Select;\;

fs.writeFileSync(path.join(componentPath, 'Select.tsx'), selectTsx);
console.log('Select.tsx created');
