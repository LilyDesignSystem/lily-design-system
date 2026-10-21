import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ResetInput component -->\n<!--\n  Description: a button input that resets a form to default values\n  HTML tag: <input>\n  CSS class: reset-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"reset-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"reset-input\"\n  type=\"reset\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Reset Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
