import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- IconListItem component -->\n<!--\n  Description: one item in an icon list with a leading icon slot\n\n  HTML tag: <li>\n  CSS class: icon-list-item\n  Keyboard: None (passive list item)\n  Accessibility:\n    - The leading icon span is decorative and uses aria-hidden=\"true\"\n    - The text span carries the accessible content of the item\n\n  Usage:\n    <li class=\"icon-list-item\">\n      <span class=\"icon-list-item-icon\" aria-hidden=\"true\">★</span>\n      <span class=\"icon-list-item-text\">Benefit description</span>\n    </li>\n-->\n\n<li class=\"icon-list-item\">\n  <span\n    class=\"icon-list-item-icon\"\n    aria-hidden=\"true\"\n  >\n    <!-- Consumer provides decorative icon content (svg, glyph, emoji) -->\n  </span>\n  <span class=\"icon-list-item-text\">\n    <!-- Consumer provides accessible text content -->\n  </span>\n</li>";

const meta = {
  title: 'Headless/Icon List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
