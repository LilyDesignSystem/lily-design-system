import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Drawer from './Drawer.vue';

const meta = {
  title: 'Headless/Drawer',
  component: Drawer,
  tags: ['autodocs']
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
