import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTableRow from './DataTableRow.vue';

const meta = {
  title: 'Headless/DataTableRow',
  component: DataTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
