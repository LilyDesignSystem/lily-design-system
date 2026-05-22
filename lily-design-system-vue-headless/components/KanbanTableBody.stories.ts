import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KanbanTableBody from './KanbanTableBody.vue';

const meta = {
  title: 'Headless/KanbanTableBody',
  component: KanbanTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
