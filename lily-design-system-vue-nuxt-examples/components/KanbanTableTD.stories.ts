import type { Meta, StoryObj } from '@storybook/vue3-vite';
import KanbanTableTD from './KanbanTableTD.vue';

const meta = {
  title: 'Headless/KanbanTableTD',
  component: KanbanTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof KanbanTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
