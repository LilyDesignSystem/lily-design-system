import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ContextMenuItem from './ContextMenuItem';

const meta = {
  title: 'Examples/ContextMenuItem',
  component: ContextMenuItem,
  tags: ['autodocs']
} satisfies Meta<typeof ContextMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
