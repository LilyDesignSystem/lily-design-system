import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="gantt-table"
  aria-label=""
>
  <!-- Consumer provides thead, tbody, tfoot -->
</table>`;

const meta = {
  title: 'Headless/GanttTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
