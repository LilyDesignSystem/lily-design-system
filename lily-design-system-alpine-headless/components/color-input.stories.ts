import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ColorInput component -->\n<!--\n  Description: an input for selecting a color value\n  HTML tag: <input>\n  CSS class: color-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"color-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"color-input\"\n  type=\"color\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Color Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
