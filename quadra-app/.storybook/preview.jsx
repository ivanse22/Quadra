import React from 'react'
import './preview.css'
import PhoneFrame from './PhoneFrame'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  globalTypes: {
    theme: {
      description: 'Tema Quadra',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
    phoneFrame: {
      description: 'Marco móvil 390px',
      toolbar: {
        title: 'Phone',
        icon: 'mobile',
        items: [
          { value: 'off', title: 'Sin marco' },
          { value: 'on', title: '390px' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    phoneFrame: 'off',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme)
      }

      const usePhone = context.globals.phoneFrame === 'on'
        || context.parameters.phoneFrame === true

      if (usePhone) {
        return (
          <PhoneFrame label={context.parameters.phoneLabel}>
            <Story />
          </PhoneFrame>
        )
      }

      return <Story />
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#FFFFFF' },
        { name: 'dark', value: '#090D0B' },
        { name: 'subtle', value: '#F8F9F8' },
      ],
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        order: [
          'Quadra DS',
          'Design Tokens',
          ['Colors', 'Typography', 'Spacing & Radii', 'Motion'],
          'App Components',
          ['Buttons', 'Forms & Inputs', 'Filters & Navigation', 'Cards', 'Feedback & States', 'Icons', 'AmountField', 'Notification Drawer'],
          'Patterns',
          ['Income (I1)', 'Home (D1)', 'Annual (A1)'],
          'App Shell',
          ['Layout', 'Notification Drawer'],
          'Layout',
          'Guidelines',
          ['Getting Started', 'Dark Mode', 'Accessibility'],
          'UI',
        ],
      },
    },
  },
}

export default preview
