import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<article\n  class=\"product-card\"\n  aria-label=\"\"\n>\n  <!-- Optional product image (consumer provides src and alt) -->\n  <img\n    class=\"product-card-image\"\n    src=\"\"\n    alt=\"\"\n  />\n\n  <!-- Required header with name and price -->\n  <header class=\"product-card-header\">\n    <!-- Product name as a heading for the article landmark -->\n    <h3 class=\"product-card-name\">\n      <!-- Consumer provides product name text -->\n    </h3>\n    <!-- Pre-formatted price text (consumer formats currency and locale) -->\n    <p class=\"product-card-price\">\n      <!-- Consumer provides formatted price text -->\n    </p>\n  </header>\n\n  <!-- Consumer provides additional content: description, ratings, actions, etc. -->\n</article>";

const meta = {
  title: 'Headless/Product Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
