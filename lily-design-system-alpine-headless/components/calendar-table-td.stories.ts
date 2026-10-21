import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTableTd component -->\n<!--\n  Description: a calendar table interactive grid data cell for managing dates, days, etc.\n  HTML tag: <td> wrapped in <table><tr>\n  CSS class: calendar-table-td\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tr><td class=\"calendar-table-td\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</td></tr></table>";

const meta = {
  title: 'Headless/Calendar Table TD',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
