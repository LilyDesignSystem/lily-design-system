import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|js)'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  }
};

export default config;
