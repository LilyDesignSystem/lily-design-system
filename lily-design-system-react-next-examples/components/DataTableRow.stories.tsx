import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataTableRow from './DataTableRow';

const meta = {
  title: 'Examples/DataTableRow',
  component: DataTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
