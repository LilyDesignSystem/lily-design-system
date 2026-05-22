import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="timer"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Timer behavior
  (function() {
    'use strict';
    document.querySelectorAll('.timer').forEach(function(el) {
      var display = el.querySelector('[data-display]');
      if (display) {
        el.setAttribute('aria-live', 'polite');
      }
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Timer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
