import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="five-face-rating-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // FiveFaceRatingPicker behavior
  (function() {
    'use strict';
    // FiveFaceRatingPicker: consumer implements interactive behavior
    document.querySelectorAll('.five-face-rating-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/FiveFaceRatingPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
