import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ImageInput component -->\n<!--\n  Description: a graphical submit button that displays an image\n  HTML tag: <input>\n  CSS class: image-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"image-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"image-input\"\n  type=\"image\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Image Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
