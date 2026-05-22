import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<td
  class="kanban-table-td"></td>`;

const meta = {
  title: 'Headless/KanbanTableTd',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
