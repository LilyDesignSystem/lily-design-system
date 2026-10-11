import type { Meta, StoryObj } from '@storybook/react-vite';
import ColorPicker from './ColorPicker';

const meta = {
  title: 'Headless/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs']
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
