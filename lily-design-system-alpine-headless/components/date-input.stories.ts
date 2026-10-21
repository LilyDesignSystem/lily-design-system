import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DateInput component -->\n<!--\n  Description: an input for entering a date value\n  HTML tag: <input>\n  CSS class: date-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"date-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"date-input\"\n  type=\"date\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Date Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
