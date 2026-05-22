import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ColorInput from './ColorInput';

const meta = {
  title: 'Examples/ColorInput',
  component: ColorInput,
  tags: ['autodocs']
} satisfies Meta<typeof ColorInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
