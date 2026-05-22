import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTableHead from './DataTableHead.vue';

const meta = {
  title: 'Headless/DataTableHead',
  component: DataTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
