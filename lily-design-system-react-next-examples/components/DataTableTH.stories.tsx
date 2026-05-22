import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataTableTH from './DataTableTH';

const meta = {
  title: 'Examples/DataTableTH',
  component: DataTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
