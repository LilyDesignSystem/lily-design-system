import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="hover-card"
  aria-label=""
  data-open="false"
>
  <!-- Consumer provides content -->
</div>

<script>
  // HoverCard behavior
  (function() {
    'use strict';
    // HoverCard: consumer implements interactive behavior
    document.querySelectorAll('.hover-card').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/HoverCard',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
