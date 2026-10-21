import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTableHead component -->\n<!--\n  Description: a calendar table interactive grid thead for managing dates, days, etc.\n  HTML tag: <thead> wrapped in <table>\n  CSS class: calendar-table-head\n  Accessibility: aria-label for accessible name\n-->\n\n<table><thead class=\"calendar-table-head\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</thead></table>";

const meta = {
  title: 'Headless/Calendar Table Head',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
