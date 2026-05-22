import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="five-star-rating-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // FiveStarRatingPicker behavior
  (function() {
    'use strict';
    // FiveStarRatingPicker: consumer implements interactive behavior
    document.querySelectorAll('.five-star-rating-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/FiveStarRatingPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
