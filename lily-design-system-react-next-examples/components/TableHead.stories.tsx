import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TableHead from './TableHead';

const meta = {
  title: 'Examples/TableHead',
  component: TableHead,
  tags: ['autodocs']
} satisfies Meta<typeof TableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
