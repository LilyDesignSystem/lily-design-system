import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="toast"
  role="status"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Toast behavior
  (function() {
    'use strict';
    document.querySelectorAll('.toast').forEach(function(el) {
      el.setAttribute('aria-live', 'polite');
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Toast',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
