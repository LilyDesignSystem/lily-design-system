import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolCallOutput from './ToolCallOutput';

const meta = {
  title: 'Headless/ToolCallOutput',
  component: ToolCallOutput,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallOutput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
