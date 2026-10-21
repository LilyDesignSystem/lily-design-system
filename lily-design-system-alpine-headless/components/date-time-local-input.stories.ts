import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DateTimeLocalInput component -->\n<!--\n  Description: an input for entering a date and time without time zone\n  HTML tag: <input>\n  CSS class: date-time-local-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"date-time-local-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"date-time-local-input\"\n  type=\"datetime-local\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Date Time Local Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
