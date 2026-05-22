import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="slide-out-drawer"
  aria-label=""
  data-open="false"
>
  <!-- Consumer provides content -->
</div>

<script>
  // SlideOutDrawer behavior
  (function() {
    'use strict';
    // SlideOutDrawer: consumer implements interactive behavior
    document.querySelectorAll('.slide-out-drawer').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/SlideOutDrawer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
