import AmountField from './AmountField';

export default {
  title: 'UI/AmountField',
  component: AmountField,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  args: {
    onChange: (val) => console.log('Amount:', val),
    showCalculatingHint: false,
  },
};

export const WithCalculatingHint = {
  args: {
    onChange: (val) => console.log('Amount:', val),
    showCalculatingHint: true,
  },
};
