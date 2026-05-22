import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HamburgerMenu from './HamburgerMenu.vue';

const meta = {
  title: 'Headless/HamburgerMenu',
  component: HamburgerMenu,
  tags: ['autodocs']
} satisfies Meta<typeof HamburgerMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
