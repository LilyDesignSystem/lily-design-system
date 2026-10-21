import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Input component -->\n<!--\n  Description: a generic HTML input element\n  HTML tag: <input>\n  CSS class: input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"input\"\n  type=\"text\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
