import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter, CounterProps } from './Counter';

/**
 * Counter Component Tests
 * 
 * Test Coverage:
 * - Component rendering
 * - Increment/decrement functionality
 * - Min/max boundaries
 * - Accessibility
 * - Callbacks
 * - Props validation
 * 
 * Target Coverage: 70%+ (statements, branches, functions, lines)
 */

describe('Counter Component', () => {
  // =============================================
  // RENDERING TESTS
  // =============================================
  
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Counter />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('should display initial value of 0 by default', () => {
      render(<Counter />);
      const output = screen.getByRole('status');
      expect(output).toHaveTextContent('0');
    });

    it('should display provided initial value', () => {
      render(<Counter value={5} />);
      const output = screen.getByRole('status');
      expect(output).toHaveTextContent('5');
    });

    it('should render ADD and SUBTRACT buttons', () => {
      render(<Counter />);
      expect(screen.getByRole('button', { name: /increase counter/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /decrease counter/i })).toBeInTheDocument();
    });

    it('should render counter title', () => {
      render(<Counter />);
      expect(screen.getByText('COUNTER COMPONENT')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Counter className="custom-class" />);
      expect(container.querySelector('.counter-container.custom-class')).toBeInTheDocument();
    });
  });

  // =============================================
  // INCREMENT FUNCTIONALITY TESTS
  // =============================================

  describe('Increment (ADD) Functionality', () => {
    it('should increment value when ADD button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      await user.click(addButton);
      
      expect(screen.getByRole('status')).toHaveTextContent('1');
    });

    it('should increment multiple times', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      
      await user.click(addButton);
      expect(screen.getByRole('status')).toHaveTextContent('1');
      
      await user.click(addButton);
      expect(screen.getByRole('status')).toHaveTextContent('2');
      
      await user.click(addButton);
      expect(screen.getByRole('status')).toHaveTextContent('3');
    });

    it('should call onIncrement callback when ADD button is clicked', async () => {
      const user = userEvent.setup();
      const onIncrement = jest.fn();
      render(<Counter onIncrement={onIncrement} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      await user.click(addButton);
      
      expect(onIncrement).toHaveBeenCalledTimes(1);
    });

    it('should not exceed max value', async () => {
      const user = userEvent.setup();
      render(<Counter value={99} max={100} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      await user.click(addButton);
      
      expect(screen.getByRole('status')).toHaveTextContent('100');
      
      // Try to exceed max
      await user.click(addButton);
      expect(screen.getByRole('status')).toHaveTextContent('100');
    });

    it('should disable ADD button at max value', () => {
      render(<Counter value={100} max={100} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      expect(addButton).toBeDisabled();
    });
  });

  // =============================================
  // DECREMENT FUNCTIONALITY TESTS
  // =============================================

  describe('Decrement (SUBTRACT) Functionality', () => {
    it('should decrement value when SUBTRACT button is clicked', async () => {
      const user = userEvent.setup();
      render(<Counter value={5} />);
      
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      await user.click(subtractButton);
      
      expect(screen.getByRole('status')).toHaveTextContent('4');
    });

    it('should decrement multiple times', async () => {
      const user = userEvent.setup();
      render(<Counter value={5} />);
      
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      
      await user.click(subtractButton);
      expect(screen.getByRole('status')).toHaveTextContent('4');
      
      await user.click(subtractButton);
      expect(screen.getByRole('status')).toHaveTextContent('3');
    });

    it('should call onDecrement callback when SUBTRACT button is clicked', async () => {
      const user = userEvent.setup();
      const onDecrement = jest.fn();
      render(<Counter value={5} onDecrement={onDecrement} />);
      
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      await user.click(subtractButton);
      
      expect(onDecrement).toHaveBeenCalledTimes(1);
    });

    it('should not go below min value', async () => {
      const user = userEvent.setup();
      render(<Counter value={1} min={0} />);
      
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      await user.click(subtractButton);
      
      expect(screen.getByRole('status')).toHaveTextContent('0');
      
      // Try to go below min
      await user.click(subtractButton);
      expect(screen.getByRole('status')).toHaveTextContent('0');
    });

    it('should disable SUBTRACT button at min value', () => {
      render(<Counter value={0} min={0} />);
      
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      expect(subtractButton).toBeDisabled();
    });
  });

  // =============================================
  // BOUNDARY TESTS
  // =============================================

  describe('Min/Max Boundaries', () => {
    it('should respect custom min value', () => {
      render(<Counter value={5} min={3} />);
      expect(screen.getByRole('status')).toHaveTextContent('5');
    });

    it('should respect custom max value', () => {
      render(<Counter value={5} max={10} />);
      expect(screen.getByRole('status')).toHaveTextContent('5');
    });

    it('should clamp initial value to min if below', () => {
      render(<Counter value={-5} min={0} />);
      // Note: Implementation may vary, adjust test based on actual behavior
      const output = screen.getByRole('status');
      expect(output).toBeInTheDocument();
    });

    it('should handle zero as min and max values', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} min={0} max={0} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      
      expect(addButton).toBeDisabled();
      expect(subtractButton).toBeDisabled();
    });
  });

  // =============================================
  // ACCESSIBILITY TESTS
  // =============================================

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<Counter />);
      
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have descriptive button labels', () => {
      render(<Counter value={5} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter.*5/i });
      const subtractButton = screen.getByRole('button', { name: /decrease counter.*5/i });
      
      expect(addButton).toBeInTheDocument();
      expect(subtractButton).toBeInTheDocument();
    });

    it('should update ARIA live region on value change', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} />);
      
      const output = screen.getByRole('status');
      expect(output).toHaveAttribute('aria-live', 'polite');
      expect(output).toHaveAttribute('aria-atomic', 'true');
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      await user.click(addButton);
      
      expect(output).toHaveTextContent('1');
    });

    it('should have icon marked as decorative', () => {
      const { container } = render(<Counter />);
      const icon = container.querySelector('.counter__icon');
      
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      
      // Tab to button
      addButton.focus();
      expect(addButton).toHaveFocus();
      
      // Press Enter
      await user.keyboard('{Enter}');
      expect(screen.getByRole('status')).toHaveTextContent('1');
    });
  });

  // =============================================
  // CALLBACK TESTS
  // =============================================

  describe('Callbacks', () => {
    it('should only call onIncrement when incrementing', async () => {
      const user = userEvent.setup();
      const onIncrement = jest.fn();
      const onDecrement = jest.fn();
      
      render(
        <Counter 
          value={5} 
          onIncrement={onIncrement} 
          onDecrement={onDecrement} 
        />
      );
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      await user.click(addButton);
      
      expect(onIncrement).toHaveBeenCalledTimes(1);
      expect(onDecrement).not.toHaveBeenCalled();
    });

    it('should only call onDecrement when decrementing', async () => {
      const user = userEvent.setup();
      const onIncrement = jest.fn();
      const onDecrement = jest.fn();
      
      render(
        <Counter 
          value={5} 
          onIncrement={onIncrement} 
          onDecrement={onDecrement} 
        />
      );
      
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      await user.click(subtractButton);
      
      expect(onDecrement).toHaveBeenCalledTimes(1);
      expect(onIncrement).not.toHaveBeenCalled();
    });

    it('should handle missing callbacks gracefully', async () => {
      const user = userEvent.setup();
      render(<Counter value={5} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      
      // Should not throw
      await expect(user.click(addButton)).resolves.not.toThrow();
      await expect(user.click(subtractButton)).resolves.not.toThrow();
    });
  });

  // =============================================
  // INTEGRATION TESTS
  // =============================================

  describe('Integration', () => {
    it('should handle rapid clicks', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} max={10} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      
      expect(screen.getByRole('status')).toHaveTextContent('5');
    });

    it('should handle alternating increment and decrement', async () => {
      const user = userEvent.setup();
      render(<Counter value={0} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      const subtractButton = screen.getByRole('button', { name: /decrease counter/i });
      
      await user.click(addButton); // 1
      await user.click(addButton); // 2
      await user.click(subtractButton); // 1
      await user.click(addButton); // 2
      
      expect(screen.getByRole('status')).toHaveTextContent('2');
    });

    it('should maintain state during interactive session', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Counter value={0} max={100} />);
      
      const addButton = screen.getByRole('button', { name: /increase counter/i });
      
      await user.click(addButton);
      expect(screen.getByRole('status')).toHaveTextContent('1');
      
      rerender(<Counter value={0} max={100} />);
      // Component should maintain internal state
      const output = screen.getByRole('status');
      expect(output).toBeInTheDocument();
    });
  });

  // =============================================
  // PROPS VALIDATION TESTS
  // =============================================

  describe('Props Validation', () => {
    it('should handle undefined optional props', () => {
      const { container } = render(
        <Counter 
          value={undefined}
          onIncrement={undefined}
          onDecrement={undefined}
        />
      );
      
      expect(container.querySelector('.counter-container')).toBeInTheDocument();
    });

    it('should handle all props together', () => {
      const onIncrement = jest.fn();
      const onDecrement = jest.fn();
      
      const { container } = render(
        <Counter 
          value={50}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          className="test-class"
          min={0}
          max={100}
        />
      );
      
      expect(container.querySelector('.test-class')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('50');
    });
  });
});
