import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- UrlInput component -->\n<!--\n  Description: an input for entering a URL\n  HTML tag: <input>\n  CSS class: url-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"url-input\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"url-input\"\n  type=\"url\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Url Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
