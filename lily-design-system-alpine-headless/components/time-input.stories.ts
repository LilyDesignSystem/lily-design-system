import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TimeInput component -->\n<!--\n  Description: an input for entering a time value\n  HTML tag: <input>\n  CSS class: time-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"time-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"time-input\"\n  type=\"time\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Time Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
