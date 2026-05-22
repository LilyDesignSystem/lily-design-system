import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tour"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Tour behavior
  (function() {
    'use strict';
    // Tour: consumer implements interactive behavior
    document.querySelectorAll('.tour').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Tour',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
