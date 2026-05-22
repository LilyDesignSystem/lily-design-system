import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="menu"
  role="menu"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Menu behavior
  (function() {
    'use strict';
    // Menu: consumer implements interactive behavior
    document.querySelectorAll('.menu').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
