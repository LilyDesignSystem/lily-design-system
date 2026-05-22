import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataTableBody from './DataTableBody';

const meta = {
  title: 'Examples/DataTableBody',
  component: DataTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
