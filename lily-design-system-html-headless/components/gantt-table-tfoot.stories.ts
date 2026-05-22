import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tfoot
  class="gantt-table-tfoot"
>
  <!-- Consumer provides child elements -->
</tfoot>`;

const meta = {
  title: 'Headless/GanttTableTfoot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
