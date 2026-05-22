import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import InputWithMask from './InputWithMask';

const meta = {
  title: 'Examples/InputWithMask',
  component: InputWithMask,
  tags: ['autodocs']
} satisfies Meta<typeof InputWithMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
