import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ProductCard component -->\n<!--\n  Description: a specialized card for displaying a product with image, title, price, and actions\n\n  HTML tag: <article>\n  CSS class: product-card\n  Keyboard: None at the card level; nested links and buttons handle their own keyboard interaction\n  Accessibility: <article> is a sectioning landmark; aria-label sets the accessible name (defaults to the product name)\n\n  Behavior:\n    Renders an <article> containing an optional <img class=\"product-card-image\">,\n    a <header class=\"product-card-header\"> with the product name in a heading\n    and the price in a paragraph, followed by consumer-provided slot content\n    (description, actions, etc.). All text and image alt are consumer-supplied.\n\n  Usage:\n    <article class=\"product-card\" aria-label=\"Wonder Widget\">\n      <img class=\"product-card-image\" src=\"...\" alt=\"...\" />\n      <header class=\"product-card-header\">\n        <h3 class=\"product-card-name\">Wonder Widget</h3>\n        <p class=\"product-card-price\">$19.99</p>\n      </header>\n      <p>Description text...</p>\n      <button class=\"button\">Add to cart</button>\n    </article>\n-->\n\n<article\n  class=\"product-card\"\n  aria-label=\"\"\n>\n  <!-- Optional product image (consumer provides src and alt) -->\n  <img\n    class=\"product-card-image\"\n    src=\"\"\n    alt=\"\"\n  />\n\n  <!-- Required header with name and price -->\n  <header class=\"product-card-header\">\n    <!-- Product name as a heading for the article landmark -->\n    <h3 class=\"product-card-name\">\n      <!-- Consumer provides product name text -->\n    </h3>\n    <!-- Pre-formatted price text (consumer formats currency and locale) -->\n    <p class=\"product-card-price\">\n      <!-- Consumer provides formatted price text -->\n    </p>\n  </header>\n\n  <!-- Consumer provides additional content: description, ratings, actions, etc. -->\n</article>";

const meta = {
  title: 'Headless/Product Card',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
