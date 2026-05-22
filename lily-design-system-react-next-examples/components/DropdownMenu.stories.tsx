import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DropdownMenu from './DropdownMenu';

const meta = {
  title: 'Examples/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs']
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
