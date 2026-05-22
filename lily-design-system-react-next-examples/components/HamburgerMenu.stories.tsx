import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HamburgerMenu from './HamburgerMenu';

const meta = {
  title: 'Examples/HamburgerMenu',
  component: HamburgerMenu,
  tags: ['autodocs']
} satisfies Meta<typeof HamburgerMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
