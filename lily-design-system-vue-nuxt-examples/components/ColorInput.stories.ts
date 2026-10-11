import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ColorInput from './ColorInput.vue';

const meta = {
  title: 'Headless/ColorInput',
  component: ColorInput,
  tags: ['autodocs']
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
