import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="kanban-table"></table>`;

const meta = {
  title: 'Headless/KanbanTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
