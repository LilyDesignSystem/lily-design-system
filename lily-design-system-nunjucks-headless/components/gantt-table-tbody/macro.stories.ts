import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tbody
  class="gantt-table-tbody"></tbody>`;

const meta = {
  title: 'Headless/GanttTableTbody',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
