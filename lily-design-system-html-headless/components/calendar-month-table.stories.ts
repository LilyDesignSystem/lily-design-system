import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="calendar-month-table"
  role="grid"
  aria-label="January 2025"
  data-view="month"
>
  <caption>Visible caption (optional)</caption>
  <!-- Consumer provides thead, tbody, tfoot: reuse the calendar-table-* sub-elements
       (calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-row,
       calendar-table-th, calendar-table-td). There are no calendar-month-table-* sub-elements. -->
  <tbody class="calendar-table-body">
    <tr class="calendar-table-row">
      <td class="calendar-table-td">1</td>
    </tr>
  </tbody>
</table>`;

const meta = {
  title: 'Headless/CalendarMonthTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
