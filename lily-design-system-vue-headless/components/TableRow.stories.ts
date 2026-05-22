import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TableRow from './TableRow.vue';

const meta = {
  title: 'Headless/TableRow',
  component: TableRow,
  tags: ['autodocs']
} satisfies Meta<typeof TableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
