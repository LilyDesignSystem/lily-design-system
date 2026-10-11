import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KanbanTableTH from './KanbanTableTH.vue';

const meta = {
  title: 'Headless/KanbanTableTH',
  component: KanbanTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
