import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Drawer from './Drawer';

const meta = {
  title: 'Examples/Drawer',
  component: Drawer,
  tags: ['autodocs']
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
