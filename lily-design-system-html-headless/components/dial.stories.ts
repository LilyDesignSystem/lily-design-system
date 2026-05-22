import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="dial"
  role="slider"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Dial behavior
  (function() {
    'use strict';
    // Dial: consumer implements interactive behavior
    document.querySelectorAll('.dial').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Dial',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
