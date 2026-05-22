import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ColorPickerButton from './ColorPickerButton';

const meta = {
  title: 'Examples/ColorPickerButton',
  component: ColorPickerButton,
  tags: ['autodocs']
} satisfies Meta<typeof ColorPickerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
