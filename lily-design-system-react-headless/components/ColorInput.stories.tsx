import type { Meta, StoryObj } from '@storybook/react-vite';
import ColorInput from './ColorInput';

const meta = {
  title: 'Headless/ColorInput',
  component: ColorInput,
  tags: ['autodocs']
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
