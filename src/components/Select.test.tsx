import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select, SelectOption } from './Select';

const options: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

describe('Select', () => {
  it('renders placeholder when no value is selected', () => {
    render(<Select options={options} value="" onChange={() => {}} placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('shows options when clicked and selects an option', () => {
    const handleChange = jest.fn();
    render(<Select options={options} value="" onChange={handleChange} />);
    const selectBox = screen.getByRole('button', { hidden: true }) || screen.getByText('Select...').parentElement;
    fireEvent.click(selectBox!);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Option 2'));
    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('disables interaction when disabled', () => {
    const handleChange = jest.fn();
    render(<Select options={options} value="" onChange={handleChange} disabled />);
    const selectBox = screen.getByText('Select...').parentElement;
    fireEvent.click(selectBox!);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows selected value', () => {
    render(<Select options={options} value="option3" onChange={() => {}} />);
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
});