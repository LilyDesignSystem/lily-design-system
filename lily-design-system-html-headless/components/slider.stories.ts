import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="slider"
  role="slider"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Slider behavior
  (function() {
    'use strict';
    // Slider: consumer implements interactive behavior
    document.querySelectorAll('.slider').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Slider',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
