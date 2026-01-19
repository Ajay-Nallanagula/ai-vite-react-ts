import type { Meta, StoryObj } from '@storybook/react';
import { Counter } from './Counter';

/**
 * Counter Component Stories
 * 
 * Interactive documentation and component testing for the Counter component.
 * 
 * Features demonstrated:
 * - Default state
 * - Various initial values
 * - Min/max boundaries
 * - Interactive controls
 * - Accessibility features
 */

const meta = {
  title: 'Components/Counter',
  component: Counter,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable Counter component with increment and decrement functionality. ' +
          'Features min/max value constraints, accessibility support, and customizable callbacks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Initial counter value',
    },
    min: {
      control: { type: 'number', min: 0, max: 50, step: 1 },
      description: 'Minimum allowed counter value',
    },
    max: {
      control: { type: 'number', min: 50, max: 200, step: 1 },
      description: 'Maximum allowed counter value',
    },
    className: {
      control: 'text',
      description: 'Optional CSS class for custom styling',
    },
    onIncrement: {
      action: 'increment clicked',
      description: 'Callback fired when increment button is clicked',
    },
    onDecrement: {
      action: 'decrement clicked',
      description: 'Callback fired when decrement button is clicked',
    },
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Counter
 * 
 * Standard counter starting at 0 with default min (0) and max (100) values.
 */
export const Default: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
};

/**
 * Counter with Initial Value
 * 
 * Counter initialized to value 50, demonstrating mid-range functionality.
 */
export const WithInitialValue: Story = {
  args: {
    value: 50,
    min: 0,
    max: 100,
  },
};

/**
 * Counter at Minimum
 * 
 * Counter at minimum value (0). The SUBTRACT button is disabled.
 */
export const AtMinimum: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
};

/**
 * Counter at Maximum
 * 
 * Counter at maximum value (100). The ADD button is disabled.
 */
export const AtMaximum: Story = {
  args: {
    value: 100,
    min: 0,
    max: 100,
  },
};

/**
 * Small Range Counter
 * 
 * Counter with a limited range (0-10). Useful for small increment scenarios.
 */
export const SmallRange: Story = {
  args: {
    value: 5,
    min: 0,
    max: 10,
  },
};

/**
 * Large Range Counter
 * 
 * Counter with a large range (0-1000). Useful for larger values.
 */
export const LargeRange: Story = {
  args: {
    value: 500,
    min: 0,
    max: 1000,
  },
};

/**
 * Custom Min Value
 * 
 * Counter with custom minimum (10) instead of 0. Shows constrained lower bound.
 */
export const CustomMinValue: Story = {
  args: {
    value: 15,
    min: 10,
    max: 100,
  },
};

/**
 * Negative to Positive Range
 * 
 * Counter spanning negative to positive values (-50 to 50).
 */
export const NegativeToPositive: Story = {
  args: {
    value: 0,
    min: -50,
    max: 50,
  },
};

/**
 * Custom Styled Counter
 * 
 * Counter with custom CSS class for alternative styling.
 */
export const CustomStyled: Story = {
  args: {
    value: 0,
    className: 'custom-counter-style',
    min: 0,
    max: 100,
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
          .custom-counter-style {
            --counter-gray: #e8f4f8;
            --counter-white: #f0f9fc;
          }
        `}</style>
        <Story />
      </>
    ),
  ],
};

/**
 * Interactive Playground
 * 
 * Fully interactive counter with all controls available.
 * Use the Storybook controls panel to adjust all props.
 */
export const Interactive: Story = {
  args: {
    value: 25,
    min: 0,
    max: 100,
    className: '',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
      <Counter {...args} />
      <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
        <p>👈 Use the controls panel above to modify props</p>
        <p>📊 Current Value: <strong>{args.value}</strong></p>
        <p>🔢 Range: {args.min} - {args.max}</p>
      </div>
    </div>
  ),
};

/**
 * Accessibility Testing
 * 
 * Counter setup for accessibility testing and screen reader validation.
 * Demonstrates ARIA labels and semantic HTML structure.
 */
export const AccessibilityTest: Story = {
  args: {
    value: 5,
    min: 0,
    max: 10,
  },
  render: (args) => (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Accessibility Features:</h2>
      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
        <li>✅ ARIA role="group" on container</li>
        <li>✅ ARIA labels on buttons with current value</li>
        <li>✅ output element with aria-live="polite"</li>
        <li>✅ Semantic button elements with type="button"</li>
        <li>✅ Icon marked with aria-hidden="true"</li>
        <li>✅ Keyboard navigable (Tab, Enter/Space)</li>
      </ul>
      <Counter {...args} />
    </div>
  ),
};

/**
 * Mobile Responsive
 * 
 * Counter in mobile viewport. Demonstrates responsive design.
 */
export const MobileResponsive: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet Responsive
 * 
 * Counter in tablet viewport. Shows responsive layout adjustments.
 */
export const TabletResponsive: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * With Callbacks
 * 
 * Counter with callback functions to demonstrate event handling.
 * Check the Actions panel in Storybook to see callback fires.
 */
export const WithCallbacks: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
};

/**
 * Disabled States
 * 
 * Demonstrates the disabled state of buttons at boundaries.
 */
export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginTop: 0, fontSize: '12px', color: '#666' }}>At Minimum (SUBTRACT disabled)</p>
        <Counter value={0} min={0} max={100} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginTop: 0, fontSize: '12px', color: '#666' }}>At Maximum (ADD disabled)</p>
        <Counter value={100} min={0} max={100} />
      </div>
    </div>
  ),
};

/**
 * Dark Mode
 * 
 * Counter in dark mode with prefers-color-scheme support.
 */
export const DarkMode: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
  parameters: {
    colorMode: 'dark',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#0a0a0a', padding: '20px', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Multiple Instances
 * 
 * Multiple counters working independently.
 */
export const MultipleInstances: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '30px',
        padding: '20px',
      }}
    >
      <div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Counter 1
        </p>
        <Counter value={0} min={0} max={100} />
      </div>
      <div>
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Counter 2
        </p>
        <Counter value={50} min={0} max={100} />
      </div>
    </div>
  ),
};
