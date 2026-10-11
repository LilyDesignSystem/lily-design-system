import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Resizable from './Resizable.vue';

const meta = {
  title: 'Headless/Resizable',
  component: Resizable,
  tags: ['autodocs']
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
