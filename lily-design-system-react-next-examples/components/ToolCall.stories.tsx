import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolCall from './ToolCall';

const meta = {
  title: 'Headless/ToolCall',
  component: ToolCall,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
