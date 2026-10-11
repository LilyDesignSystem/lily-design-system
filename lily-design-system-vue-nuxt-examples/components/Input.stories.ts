import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Input from './Input.vue';

const meta = {
  title: 'Headless/Input',
  component: Input,
  tags: ['autodocs']
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
