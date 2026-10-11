import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Button from './Button.vue';

const meta = {
  title: 'Headless/Button',
  component: Button,
  tags: ['autodocs']
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
