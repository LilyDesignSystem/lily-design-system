import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ImageFileInput component -->\n<!--\n  Description: an input for selecting image files with preview\n  HTML tag: <input>\n  CSS class: image-file-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"image-file-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"image-file-input\"\n  type=\"file\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Image File Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
