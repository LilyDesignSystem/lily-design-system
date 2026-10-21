import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<table\n  class=\"calendar-week-table\"\n  role=\"grid\"\n  aria-label=\"Week of 6 January 2025\"\n  data-view=\"week\"\n>\n  <caption>Visible caption (optional)</caption>\n  <!-- Consumer provides thead, tbody, tfoot: reuse the calendar-table-* sub-elements\n       (calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-row,\n       calendar-table-th, calendar-table-td). There are no calendar-week-table-* sub-elements. -->\n  <tbody class=\"calendar-table-body\">\n    <tr class=\"calendar-table-row\">\n      <td class=\"calendar-table-td\">1</td>\n    </tr>\n  </tbody>\n</table>";

const meta = {
  title: 'Headless/Calendar Week Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
