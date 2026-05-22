import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="popover"
  aria-label=""
  data-open="false"
>
  <!-- Consumer provides content -->
</div>

<script>
  // Popover behavior
  (function() {
    'use strict';
    // Popover: consumer implements interactive behavior
    document.querySelectorAll('.popover').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Popover',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
