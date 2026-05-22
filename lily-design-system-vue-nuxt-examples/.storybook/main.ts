import type { StorybookConfig } from '@storybook/vue3-vite';
import { mergeConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const config: StorybookConfig = {
  stories: ['../components/**/*.stories.@(ts|js)'],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, { plugins: [vue()] });
  }
};

export default config;
