import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContextMenu from './ContextMenu';

const meta = {
  title: 'Examples/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs']
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
