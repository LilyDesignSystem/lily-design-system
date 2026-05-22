import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|js)'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  }
};

export default config;
