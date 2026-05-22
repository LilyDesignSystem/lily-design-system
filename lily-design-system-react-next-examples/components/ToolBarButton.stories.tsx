import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ToolBarButton from './ToolBarButton';

const meta = {
  title: 'Examples/ToolBarButton',
  component: ToolBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof ToolBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
