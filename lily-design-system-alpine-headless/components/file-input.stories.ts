import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FileInput component -->\n<!--\n  Description: an input for selecting files from the file system\n  HTML tag: <input>\n  CSS class: file-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"file-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"file-input\"\n  type=\"file\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/File Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
