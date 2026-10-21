import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CalendarTable component -->\n<!--\n  Description: a calendar table interactive grid for managing dates, days, etc.\n  HTML tag: <table>\n  CSS class: calendar-table\n  Keyboard: None (passive element)\n  Accessibility: Implicit table role, aria-label for accessible name\n  Usage:\n    <table class=\"calendar-table\" aria-label=\"Example\">\n      ...\n    </table>\n-->\n\n<table\n  class=\"calendar-table\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides thead, tbody, tfoot -->\n</table>";

const meta = {
  title: 'Headless/Calendar Table',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
