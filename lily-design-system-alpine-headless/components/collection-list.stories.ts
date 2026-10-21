import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CollectionList component -->\n<!--\n  Description: a compact list of multiple related items such as articles or events\n\n  HTML tag: <ul>\n  CSS class: collection-list\n  Keyboard: None (passive list; inner links are focusable as usual)\n  Accessibility: The native <ul> conveys list semantics. An optional aria-label provides an accessible name for the collection.\n\n  Usage:\n    <ul class=\"collection-list\" aria-label=\"Recent articles\">\n      <li class=\"collection-list-item\">…</li>\n      <li class=\"collection-list-item\">…</li>\n    </ul>\n-->\n\n<ul\n  class=\"collection-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides <li class=\"collection-list-item\"> children -->\n</ul>";

const meta = {
  title: 'Headless/Collection List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
