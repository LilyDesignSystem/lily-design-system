import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarDayTable component -->\n<!--\n  Description: a calendar grid showing the time slots of one day: one row per slot. A structural wrapper like\n    calendar-table: the consumer supplies head, body, rows and cells.\n  HTML tag: <table role=\"grid\">\n  CSS class: calendar-day-table\n  Data attribute: data-view=\"day\" lets consumer CSS and JS key on the view\n  Keyboard: None built-in. The consumer implements grid keyboard navigation\n    (arrow keys for cell movement, Enter/Space for selection).\n  Accessibility: role=\"grid\" identifies an interactive grid widget; aria-label\n    names the period shown (required, consumer-supplied, e.g. \"Monday 6 January 2025\").\n    An optional <caption> gives a visible name.\n  Internationalization: the consumer owns locale formatting (Intl) and all\n    cell content; no text is hardcoded here (the strings below are demo only).\n  Usage:\n    <table\n      class=\"calendar-day-table\"\n      role=\"grid\"\n      aria-label=\"Monday 6 January 2025\"\n      data-view=\"day\"\n    >\n      <caption>Visible caption (optional)</caption>\n      … Consumer provides thead, tbody, tfoot: reuse the calendar-table-* sub-elements\n           (calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-row,\n           calendar-table-th, calendar-table-td). There are no calendar-day-table-* sub-elements. …\n      <tbody class=\"calendar-table-body\">\n        <tr class=\"calendar-table-row\">\n          <td class=\"calendar-table-td\">1</td>\n        </tr>\n      </tbody>\n    </table>\n-->\n\n<table\n  class=\"calendar-day-table\"\n  role=\"grid\"\n  aria-label=\"Monday 6 January 2025\"\n  data-view=\"day\"\n>\n  <caption>Visible caption (optional)</caption>\n  <!-- Consumer provides thead, tbody, tfoot: reuse the calendar-table-* sub-elements\n       (calendar-table-head, calendar-table-body, calendar-table-foot, calendar-table-row,\n       calendar-table-th, calendar-table-td). There are no calendar-day-table-* sub-elements. -->\n  <tbody class=\"calendar-table-body\">\n    <tr class=\"calendar-table-row\">\n      <td class=\"calendar-table-td\">1</td>\n    </tr>\n  </tbody>\n</table>";

const meta = {
  title: 'Headless/Calendar Day Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
