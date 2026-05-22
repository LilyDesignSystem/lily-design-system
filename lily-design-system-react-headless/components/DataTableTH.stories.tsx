import type { Meta, StoryObj } from '@storybook/react-vite';
import DataTableTH from './DataTableTH';

const meta = {
  title: 'Headless/DataTableTH',
  component: DataTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
