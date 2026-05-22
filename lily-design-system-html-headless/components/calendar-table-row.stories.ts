import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tr
  class="calendar-table-row"
>
  <!-- Consumer provides child elements -->
</tr>`;

const meta = {
  title: 'Headless/CalendarTableRow',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
