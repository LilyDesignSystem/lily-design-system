import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolCallInput from './ToolCallInput';

const meta = {
  title: 'Headless/ToolCallInput',
  component: ToolCallInput,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
