import type { Meta, StoryObj } from '@storybook/react-vite';
import TableHead from './TableHead';

const meta = {
  title: 'Headless/TableHead',
  component: TableHead,
  tags: ['autodocs']
} satisfies Meta<typeof TableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
