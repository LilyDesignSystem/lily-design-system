import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="calendar-week-table"
  role="grid"
  aria-label="Week of 6 January 2025"
  data-view="week"
>
  <caption>Visible caption (optional)</caption>
  <!-- Consumer provides thead, tbody, tfoot: reuse the calendar-table-* sub-elements
       (calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-row,
       calendar-table-th, calendar-table-td). There are no calendar-week-table-* sub-elements. -->
  <tbody class="calendar-table-body">
    <tr class="calendar-table-row">
      <td class="calendar-table-td">1</td>
    </tr>
  </tbody>
</table>`;

const meta = {
  title: 'Headless/CalendarWeekTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
