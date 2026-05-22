import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="command"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Command behavior
  (function() {
    'use strict';
    // Command: consumer implements interactive behavior
    document.querySelectorAll('.command').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Command',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
