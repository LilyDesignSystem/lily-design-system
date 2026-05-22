import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemeProvider from './ThemeProvider.vue';

const meta = {
  title: 'Headless/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
