import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tooltip"
  role="tooltip"
  aria-label=""
  aria-hidden="true"
>
  <!-- Consumer provides content -->
</div>

<script>
  // Tooltip behavior
  (function() {
    'use strict';
    // Tooltip: consumer implements interactive behavior
    document.querySelectorAll('.tooltip').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Tooltip',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
