import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTableFoot component -->\n<!--\n  Description: a calendar table interactive grid tfoot for managing dates, days, etc.\n  HTML tag: <tfoot> wrapped in <table>\n  CSS class: calendar-table-foot\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tfoot class=\"calendar-table-foot\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tfoot></table>";

const meta = {
  title: 'Headless/Calendar Table Foot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
