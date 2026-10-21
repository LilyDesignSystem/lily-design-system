import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTableTh component -->\n<!--\n  Description: a calendar table interactive grid column for managing dates, days, etc.\n  HTML tag: <th> wrapped in <table><thead><tr>\n  CSS class: calendar-table-th\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead><tr><th class=\"calendar-table-th\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</th></tr></thead></table>";

const meta = {
  title: 'Headless/Calendar Table TH',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
