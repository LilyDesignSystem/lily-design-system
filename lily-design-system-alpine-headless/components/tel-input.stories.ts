import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TelInput component -->\n<!--\n  Description: an input for entering a telephone number\n  HTML tag: <input>\n  CSS class: tel-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"tel-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"tel-input\"\n  type=\"tel\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Tel Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
