import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dialog
  class="alert-dialog"
  role="alertdialog"
  aria-label=""
  aria-modal="true"
>
  <!-- Consumer provides dialog content -->
</dialog>

<script>
  // AlertDialog behavior
  (function() {
    'use strict';
    document.querySelectorAll('.alert-dialog').forEach(function(el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          el.close ? el.close() : el.setAttribute('data-open', 'false');
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/AlertDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
