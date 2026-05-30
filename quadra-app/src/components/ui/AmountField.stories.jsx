import { useState } from 'react'
import AmountField from './AmountField'

export default {
  title: 'App Components/AmountField',
  component: AmountField,
  parameters: {
    layout: 'centered',
    phoneFrame: true,
    phoneLabel: 'AmountField',
  },
}

export const Default = {
  args: {
    onChange: (val) => console.log('Amount:', val),
    showCalculatingHint: false,
  },
}

export const WithCalculatingHint = {
  args: {
    onChange: (val) => console.log('Amount:', val),
    showCalculatingHint: true,
  },
}

export const WithCurrencyPicker = () => {
  const [currency, setCurrency] = useState('COP')
  return (
    <AmountField
      currency={currency}
      onCurrencyChange={setCurrency}
      onChange={() => {}}
      exchangeRates={{ USD: 4000, EUR: 4560 }}
    />
  )
}
WithCurrencyPicker.parameters = { phoneFrame: true }
