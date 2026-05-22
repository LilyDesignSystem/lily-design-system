import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="sonner"
  role="status"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Sonner behavior
  (function() {
    'use strict';
    document.querySelectorAll('.sonner').forEach(function(el) {
      el.setAttribute('aria-live', 'polite');
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Sonner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
