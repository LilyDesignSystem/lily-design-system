import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTableRow component -->\n<!--\n  Description: a calendar table interactive grid row for managing dates, days, etc.\n  HTML tag: <tr> wrapped in <table>\n  CSS class: calendar-table-row\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr class=\"calendar-table-row\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tr></table>";

const meta = {
  title: 'Headless/Calendar Table Row',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
