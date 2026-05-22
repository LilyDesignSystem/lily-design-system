import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="carousel"
  role="region"
  aria-label=""
  aria-roledescription="carousel"
>
  <!-- Consumer provides content -->
</div>

<script>
  // Carousel behavior
  (function() {
    'use strict';
    // Carousel: consumer implements interactive behavior
    document.querySelectorAll('.carousel').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Carousel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
