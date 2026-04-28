import InstallBanner from '../components/ui/InstallBanner';

export default {
  title: 'UI/InstallBanner',
  component: InstallBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    onInstall: () => alert('Install triggered'),
    onDismiss: () => alert('Dismissed'),
  },
};
