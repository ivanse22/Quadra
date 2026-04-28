import { ToastItem } from './Toast';

export default {
  title: 'UI/ToastItem',
  component: ToastItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Success = {
  args: {
    toast: { id: 1, type: 'success', message: 'Operación exitosa' },
    onDismiss: () => console.log('Dismissed'),
  },
};

export const Error = {
  args: {
    toast: { id: 2, type: 'error', message: 'Hubo un error en la transferencia' },
    onDismiss: () => console.log('Dismissed'),
  },
};

export const InfoWithAction = {
  args: {
    toast: { 
      id: 3, 
      type: 'info', 
      message: 'Nueva actualización disponible',
      action: { label: 'Actualizar', fn: () => console.log('Action clicked') }
    },
    onDismiss: () => console.log('Dismissed'),
  },
};
