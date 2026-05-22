import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTableTH from './DataTableTH.vue';

const meta = {
  title: 'Headless/DataTableTH',
  component: DataTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
