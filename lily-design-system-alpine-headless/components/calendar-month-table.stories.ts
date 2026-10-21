import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table\n  class=\"calendar-month-table\"\n  role=\"grid\"\n  aria-label=\"January 2025\"\n  data-view=\"month\"\n>\n  <caption>Visible caption (optional)</caption>\n  <!-- Consumer provides thead, tbody, tfoot: reuse the calendar-table-* sub-elements\n       (calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-row,\n       calendar-table-th, calendar-table-td). There are no calendar-month-table-* sub-elements. -->\n  <tbody class=\"calendar-table-body\">\n    <tr class=\"calendar-table-row\">\n      <td class=\"calendar-table-td\">1</td>\n    </tr>\n  </tbody>\n</table>";

const meta = {
  title: 'Headless/Calendar Month Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
