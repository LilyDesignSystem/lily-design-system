import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KanbanTableFoot from './KanbanTableFoot.vue';

const meta = {
  title: 'Headless/KanbanTableFoot',
  component: KanbanTableFoot,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableFoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
