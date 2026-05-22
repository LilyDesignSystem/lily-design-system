import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DataTableTD from './DataTableTD';

const meta = {
  title: 'Examples/DataTableTD',
  component: DataTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
