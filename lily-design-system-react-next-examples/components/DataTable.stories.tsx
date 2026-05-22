import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataTable from './DataTable';

const meta = {
  title: 'Examples/DataTable',
  component: DataTable,
  tags: ['autodocs']
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
