import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KanbanTableHead from './KanbanTableHead.vue';

const meta = {
  title: 'Headless/KanbanTableHead',
  component: KanbanTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
