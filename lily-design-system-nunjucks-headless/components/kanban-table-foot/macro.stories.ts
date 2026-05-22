import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tfoot
  class="kanban-table-foot"></tfoot>`;

const meta = {
  title: 'Headless/KanbanTableFoot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
