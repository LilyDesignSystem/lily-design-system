import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Sidebar from './Sidebar.vue';

const meta = {
  title: 'Headless/Sidebar',
  component: Sidebar,
  tags: ['autodocs']
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
