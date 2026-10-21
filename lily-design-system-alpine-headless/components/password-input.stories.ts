import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- PasswordInput component -->\n<!--\n  Description: an input for entering a password with obscured text\n  HTML tag: <input>\n  CSS class: password-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"password-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"password-input\"\n  type=\"password\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Password Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
