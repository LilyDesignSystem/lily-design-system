import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TextInput component -->\n<!--\n  Description: a single-line text input field\n  HTML tag: <input>\n  CSS class: text-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"text-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"text-input\"\n  type=\"text\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Text Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
