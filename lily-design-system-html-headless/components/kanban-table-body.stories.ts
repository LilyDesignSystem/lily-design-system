import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tbody
  class="kanban-table-body"
>
  <!-- Consumer provides child elements -->
</tbody>`;

const meta = {
  title: 'Headless/KanbanTableBody',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
