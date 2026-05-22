import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tr
  class="gantt-table-tr"
>
  <!-- Consumer provides child elements -->
</tr>`;

const meta = {
  title: 'Headless/GanttTableTr',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
