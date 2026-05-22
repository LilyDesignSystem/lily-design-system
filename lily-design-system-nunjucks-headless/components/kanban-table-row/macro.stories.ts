import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tr
  class="kanban-table-row"></tr>`;

const meta = {
  title: 'Headless/KanbanTableRow',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
