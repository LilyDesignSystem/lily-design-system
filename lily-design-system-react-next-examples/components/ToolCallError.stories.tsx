import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolCallError from './ToolCallError';

const meta = {
  title: 'Headless/ToolCallError',
  component: ToolCallError,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
