import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Badge from './Badge';

const meta = {
  title: 'Examples/Badge',
  component: Badge,
  tags: ['autodocs']
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
