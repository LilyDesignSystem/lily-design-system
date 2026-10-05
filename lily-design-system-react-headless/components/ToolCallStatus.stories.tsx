import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolCallStatus from './ToolCallStatus';

const meta = {
  title: 'Headless/ToolCallStatus',
  component: ToolCallStatus,
  tags: ['autodocs']
} satisfies Meta<typeof ToolCallStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
