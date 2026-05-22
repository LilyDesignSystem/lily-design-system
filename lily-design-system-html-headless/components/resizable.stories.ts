import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="resizable"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Resizable behavior
  (function() {
    'use strict';
    // Resizable: consumer implements interactive behavior
    document.querySelectorAll('.resizable').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Resizable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
