import type { Meta, StoryObj } from '@storybook/react-vite';
import ContextMenu from './ContextMenu';

const meta = {
  title: 'Headless/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs']
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
