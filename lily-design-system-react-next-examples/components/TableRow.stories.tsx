import type { Meta, StoryObj } from '@storybook/react-vite';
import TableRow from './TableRow';

const meta = {
  title: 'Headless/TableRow',
  component: TableRow,
  tags: ['autodocs']
} satisfies Meta<typeof TableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
