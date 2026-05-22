import type { Meta, StoryObj } from '@storybook/vue3-vite';
import InputWithMask from './InputWithMask.vue';

const meta = {
  title: 'Headless/InputWithMask',
  component: InputWithMask,
  tags: ['autodocs']
} satisfies Meta<typeof InputWithMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
