import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MonthInput component -->\n<!--\n  Description: an input for selecting a month and year\n  HTML tag: <input>\n  CSS class: month-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"month-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"month-input\"\n  type=\"month\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Month Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
