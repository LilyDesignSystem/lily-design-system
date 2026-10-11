import type { Meta, StoryObj } from '@storybook/react-vite';
import HamburgerMenu from './HamburgerMenu';

const meta = {
  title: 'Headless/HamburgerMenu',
  component: HamburgerMenu,
  tags: ['autodocs']
} satisfies Meta<typeof HamburgerMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
