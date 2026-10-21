import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- EmailInput component -->\n<!--\n  Description: an input for entering an email address\n  HTML tag: <input>\n  CSS class: email-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"email-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"email-input\"\n  type=\"email\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Email Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
