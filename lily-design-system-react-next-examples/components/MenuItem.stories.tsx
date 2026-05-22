import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MenuItem from './MenuItem';

const meta = {
  title: 'Examples/MenuItem',
  component: MenuItem,
  tags: ['autodocs']
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
