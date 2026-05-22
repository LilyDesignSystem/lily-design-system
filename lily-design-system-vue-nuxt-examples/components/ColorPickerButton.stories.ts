import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ColorPickerButton from './ColorPickerButton.vue';

const meta = {
  title: 'Examples/ColorPickerButton',
  component: ColorPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof ColorPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
