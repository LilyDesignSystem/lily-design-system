import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DataTableTD from './DataTableTD.vue';

const meta = {
  title: 'Headless/DataTableTD',
  component: DataTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof DataTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
