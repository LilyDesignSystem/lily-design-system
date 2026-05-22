import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DoListItem from './DoListItem';

const meta = {
  title: 'Examples/DoListItem',
  component: DoListItem,
  tags: ['autodocs']
} satisfies Meta<typeof DoListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
