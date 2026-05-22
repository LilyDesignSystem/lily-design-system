import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTableBody from './DataTableBody.vue';

const meta = {
  title: 'Headless/DataTableBody',
  component: DataTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
