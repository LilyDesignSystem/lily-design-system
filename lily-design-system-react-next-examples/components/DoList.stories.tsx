import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DoList from './DoList';

const meta = {
  title: 'Examples/DoList',
  component: DoList,
  tags: ['autodocs']
} satisfies Meta<typeof DoList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
