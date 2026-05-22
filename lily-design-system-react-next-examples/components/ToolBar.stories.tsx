import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ToolBar from './ToolBar';

const meta = {
  title: 'Examples/ToolBar',
  component: ToolBar,
  tags: ['autodocs']
} satisfies Meta<typeof ToolBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
