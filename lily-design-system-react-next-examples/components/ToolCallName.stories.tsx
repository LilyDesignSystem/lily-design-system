import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolCallName from './ToolCallName';

const meta = {
  title: 'Headless/ToolCallName',
  component: ToolCallName,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
