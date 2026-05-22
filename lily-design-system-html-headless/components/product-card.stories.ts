import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="product-card"
  aria-label=""
>
  <!-- Optional product image (consumer provides src and alt) -->
  <img
    class="product-card-image"
    src=""
    alt=""
  />

  <!-- Required header with name and price -->
  <header class="product-card-header">
    <!-- Product name as a heading for the article landmark -->
    <h3 class="product-card-name">
      <!-- Consumer provides product name text -->
    </h3>
    <!-- Pre-formatted price text (consumer formats currency and locale) -->
    <p class="product-card-price">
      <!-- Consumer provides formatted price text -->
    </p>
  </header>

  <!-- Consumer provides additional content: description, ratings, actions, etc. -->
</article>`;

const meta = {
  title: 'Headless/ProductCard',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
