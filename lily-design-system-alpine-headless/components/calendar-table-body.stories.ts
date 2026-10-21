import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTableBody component -->\n<!--\n  Description: a calendar table interactive grid tbody for managing dates, days, etc.\n  HTML tag: <tbody> wrapped in <table>\n  CSS class: calendar-table-body\n  Accessibility: aria-label for accessible name\n-->\n\n<table><tbody class=\"calendar-table-body\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</tbody></table>";

const meta = {
  title: 'Headless/Calendar Table Body',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
