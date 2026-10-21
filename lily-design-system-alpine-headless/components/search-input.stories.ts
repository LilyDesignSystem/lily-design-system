import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SearchInput component -->\n<!--\n  Description: an input for entering a search query\n  HTML tag: <input>\n  CSS class: search-input\n  Keyboard: Tab to focus, standard input keyboard interactions\n  Accessibility: role=\"searchbox\", Implicit input role, aria-label for accessible name\n  Usage:\n    <input class=\"search-input\" role=\"searchbox\" aria-label=\"Example\">\n      ...\n    \n-->\n\n<input\n  class=\"search-input\"\n  role=\"searchbox\"\n  type=\"search\"\n  aria-label=\"\"\n>";

const meta = {
  title: 'Headless/Search Input',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
