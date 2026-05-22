import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTableFoot from './DataTableFoot.vue';

const meta = {
  title: 'Headless/DataTableFoot',
  component: DataTableFoot,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableFoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
