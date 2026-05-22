import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ColorPicker from './ColorPicker.vue';

const meta = {
  title: 'Examples/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs']
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
