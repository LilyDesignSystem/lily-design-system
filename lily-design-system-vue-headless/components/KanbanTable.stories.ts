import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KanbanTable from './KanbanTable.vue';

const meta = {
  title: 'Headless/KanbanTable',
  component: KanbanTable,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
