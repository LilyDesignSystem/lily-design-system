import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</article>
-->

<article
  class="feature-card"
  data-image-position="start"
  aria-label=""
>
  <img class="feature-card-image" src="" alt="">
  <header class="feature-card-header">
    <h3 class="feature-card-heading">
      <!-- Consumer provides heading text -->
    </h3>
  </header>
  <p class="feature-card-description">
    <!-- Consumer provides description text (optional) -->
  </p>
  <!-- Consumer provides additional content (e.g., CTAs) -->
</article>`;

const meta = {
  title: 'Headless/FeatureCard',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
