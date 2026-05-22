import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolBar from './ToolBar';

const meta = {
  title: 'Headless/ToolBar',
  component: ToolBar,
  tags: ['autodocs']
} satisfies Meta<typeof ToolBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
