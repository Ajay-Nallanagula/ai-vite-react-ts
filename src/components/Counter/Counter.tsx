import React, { useState } from 'react';
import './Counter.css';

/**
 * Counter Component
 * 
 * A reusable counter component with ADD and SUBTRACT buttons.
 * Features:
 * - Increment/decrement counter value
 * - Accessible button controls
 * - Responsive design with shadow effects
 * 
 * @component
 * @example
 * const [count, setCount] = useState(0);
 * return <Counter value={count} onIncrement={() => setCount(count + 1)} onDecrement={() => setCount(count - 1)} />
 */

export interface CounterProps {
  /** Initial counter value */
  value?: number;
  /** Callback when increment button is clicked */
  onIncrement?: () => void;
  /** Callback when decrement button is clicked */
  onDecrement?: () => void;
  /** Optional CSS class for custom styling */
  className?: string;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
}

export const Counter: React.FC<CounterProps> = ({
  value = 0,
  onIncrement,
  onDecrement,
  className = '',
  min = 0,
  max = 100,
}) => {
  const [internalCount, setInternalCount] = useState(value);

  const handleIncrement = () => {
    if (internalCount < max) {
      const newCount = internalCount + 1;
      setInternalCount(newCount);
      onIncrement?.();
    }
  };

  const handleDecrement = () => {
    if (internalCount > min) {
      const newCount = internalCount - 1;
      setInternalCount(newCount);
      onDecrement?.();
    }
  };

  return (
    <div className={`counter-container ${className}`} role="group" aria-label="Counter control">
      <section className="counter__section">
        {/* Decrement Button Area */}
        <div className="counter__button-group counter__button-group--subtract">
          <svg
            className="counter__icon"
            width="29.82"
            height="47.18"
            viewBox="0 0 30 47"
            aria-hidden="true"
          >
            <circle cx="15" cy="23.5" r="10" fill="currentColor" />
          </svg>
          <button
            className="counter__button counter__button--subtract"
            onClick={handleDecrement}
            disabled={internalCount <= min}
            aria-label={`Decrease counter. Current value: ${internalCount}`}
            type="button"
          >
            <span className="counter__button-text">SUBTRACT</span>
          </button>
        </div>

        {/* Display Area */}
        <div className="counter__display-area">
          <div className="counter__display-slot" />
          <div className="counter__display-value">
            <span className="counter__title">COUNTER COMPONENT</span>
          </div>
        </div>

        {/* Increment Button Area */}
        <div className="counter__button-group counter__button-group--add">
          <button
            className="counter__button counter__button--add"
            onClick={handleIncrement}
            disabled={internalCount >= max}
            aria-label={`Increase counter. Current value: ${internalCount}`}
            type="button"
          >
            <span className="counter__button-text">ADD</span>
          </button>
        </div>

        {/* Counter Value Display */}
        <output className="counter__output" aria-live="polite" aria-atomic="true">
          {internalCount}
        </output>
      </section>
    </div>
  );
};

export default Counter;
