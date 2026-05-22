import type { Meta, StoryObj } from '@storybook/react-vite';
import DropdownMenu from './DropdownMenu';

const meta = {
  title: 'Headless/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs']
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
