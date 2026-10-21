import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableHead from './DataTableHead';

const meta = {
  title: 'Headless/DataTableHead',
  component: DataTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableHead>;

export default meta;
type Story = StoryObj<typeof DataTableHead>;

export const Default: Story = {};
