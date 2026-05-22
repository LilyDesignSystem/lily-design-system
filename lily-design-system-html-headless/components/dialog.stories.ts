import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dialog
  class="dialog"
  role="dialog"
  aria-label=""
  aria-modal="true"
>
  <!-- Consumer provides dialog content -->
</dialog>

<script>
  // Dialog behavior
  (function() {
    'use strict';
    document.querySelectorAll('.dialog').forEach(function(el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          el.close ? el.close() : el.setAttribute('data-open', 'false');
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Dialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
