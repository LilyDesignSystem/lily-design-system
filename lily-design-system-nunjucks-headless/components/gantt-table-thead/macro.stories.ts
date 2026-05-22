import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<thead
  class="gantt-table-thead"></thead>`;

const meta = {
  title: 'Headless/GanttTableThead',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
