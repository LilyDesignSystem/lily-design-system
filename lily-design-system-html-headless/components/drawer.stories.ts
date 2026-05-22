import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="drawer"
  aria-label=""
  data-open="false"
>
  <!-- Consumer provides content -->
</div>

<script>
  // Drawer behavior
  (function() {
    'use strict';
    // Drawer: consumer implements interactive behavior
    document.querySelectorAll('.drawer').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Drawer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
