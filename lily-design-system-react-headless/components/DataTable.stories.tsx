import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTable from './DataTable';

const meta = {
  title: 'Headless/DataTable',
  component: DataTable,
  tags: ['autodocs']
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
