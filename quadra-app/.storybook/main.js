/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = process.env.STORYBOOK_BASE_PATH || '/Quadra/'
    }
    config.plugins = (config.plugins || []).filter(
      (plugin) => plugin?.name !== 'vite-plugin-pwa' && plugin?.name !== 'vite-plugin-pwa:build',
    )
    return config
  },
}
export default config