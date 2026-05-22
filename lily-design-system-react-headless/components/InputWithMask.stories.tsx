import type { Meta, StoryObj } from '@storybook/react-vite';
import InputWithMask from './InputWithMask';

const meta = {
  title: 'Headless/InputWithMask',
  component: InputWithMask,
  tags: ['autodocs']
} satisfies Meta<typeof InputWithMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
