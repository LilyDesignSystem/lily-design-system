import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DropdownMenu from './DropdownMenu.vue';

const meta = {
  title: 'Headless/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs']
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
