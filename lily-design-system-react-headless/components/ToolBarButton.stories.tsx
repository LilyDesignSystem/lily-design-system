import type { Meta, StoryObj } from '@storybook/react-vite';
import ToolBarButton from './ToolBarButton';

const meta = {
  title: 'Headless/ToolBarButton',
  component: ToolBarButton,
  tags: ['autodocs']
} satisfies Meta<typeof ToolBarButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
