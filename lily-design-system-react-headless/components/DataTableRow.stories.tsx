import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableRow from './DataTableRow';

const meta = {
  title: 'Headless/DataTableRow',
  component: DataTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
