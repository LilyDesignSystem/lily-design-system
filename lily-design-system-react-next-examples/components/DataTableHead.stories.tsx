import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataTableHead from './DataTableHead';

const meta = {
  title: 'Examples/DataTableHead',
  component: DataTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
