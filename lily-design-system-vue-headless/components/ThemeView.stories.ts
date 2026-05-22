import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ThemeView from './ThemeView.vue';

const meta = {
  title: 'Headless/ThemeView',
  component: ThemeView,
  tags: ['autodocs']
} satisfies Meta<typeof ThemeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
