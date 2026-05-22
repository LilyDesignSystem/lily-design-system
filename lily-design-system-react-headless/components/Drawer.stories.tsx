import type { Meta, StoryObj } from '@storybook/react-vite';
import Drawer from './Drawer';

const meta = {
  title: 'Headless/Drawer',
  component: Drawer,
  tags: ['autodocs']
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
