import '../src/styles/index.css';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    },

    options: {
      storySort: {
        order: [
          'Quadra DS',
          'Design Tokens',  ['Colors', 'Typography', 'Spacing & Radii', 'Motion'],
          'App Components', ['Buttons', 'Forms & Inputs', 'Cards', 'Feedback & States', 'Icons', 'AmountField', 'Notification Drawer'],
          'App Shell',      ['Layout', 'Notification Drawer'],
          'Layout',
          'Guidelines',     ['Getting Started', 'Dark Mode', 'Accessibility'],
          'UI',
        ],
      },
    },
  },
};

export default preview;