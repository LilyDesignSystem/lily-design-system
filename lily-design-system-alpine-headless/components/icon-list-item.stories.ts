import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<li class=\"icon-list-item\">\n  <span\n    class=\"icon-list-item-icon\"\n    aria-hidden=\"true\"\n  >\n    <!-- Consumer provides decorative icon content (svg, glyph, emoji) -->\n  </span>\n  <span class=\"icon-list-item-text\">\n    <!-- Consumer provides accessible text content -->\n  </span>\n</li>";

const meta = {
  title: 'Headless/Icon List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
