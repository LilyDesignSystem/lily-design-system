import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<article
  class="product-card"
  aria-label=""><header class="product-card-header"></header></article>`;

const meta = {
  title: 'Headless/ProductCard',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
