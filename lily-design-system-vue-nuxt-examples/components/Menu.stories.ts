import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Menu from './Menu.vue';

const meta = {
  title: 'Headless/Menu',
  component: Menu,
  tags: ['autodocs']
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
