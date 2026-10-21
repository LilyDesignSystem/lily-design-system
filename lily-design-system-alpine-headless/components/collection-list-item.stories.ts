import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CollectionListItem component -->\n<!--\n  Description: one item in a collection list with optional image, heading, meta, and description\n\n  HTML tag: <li>\n  CSS class: collection-list-item\n  Keyboard: None directly (inner <a> is focusable when href is provided)\n  Accessibility: Heading and link semantics are native. aria-label is optional and overrides the computed accessible name.\n\n  Usage:\n    <li class=\"collection-list-item\">\n      <img class=\"collection-list-item-image\" src=\"…\" alt=\"…\">\n      <h3 class=\"collection-list-item-heading\">\n        <a href=\"/article/1\">Article title</a>\n      </h3>\n      <p class=\"collection-list-item-meta\">January 1, 2026</p>\n      <p class=\"collection-list-item-description\">Short description.</p>\n    </li>\n-->\n\n<li\n  class=\"collection-list-item\"\n  aria-label=\"\"\n>\n  <!-- Optional image:\n       <img class=\"collection-list-item-image\" src=\"\" alt=\"\"> -->\n\n  <h3 class=\"collection-list-item-heading\">\n    <!-- When href is provided, wrap heading text in <a href=\"…\"></a>;\n         otherwise plain text content is used. -->\n  </h3>\n\n  <!-- Optional meta line:\n       <p class=\"collection-list-item-meta\"></p> -->\n\n  <!-- Optional description:\n       <p class=\"collection-list-item-description\"></p> -->\n\n  <!-- Consumer may provide additional children below -->\n</li>";

const meta = {
  title: 'Headless/Collection List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
