import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<dialog
  class="file-dialog"
  aria-label=""
  aria-modal="true"
>
  <!-- Consumer provides dialog content -->
</dialog>

<script>
  // FileDialog behavior
  (function() {
    'use strict';
    document.querySelectorAll('.file-dialog').forEach(function(el) {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          el.close ? el.close() : el.setAttribute('data-open', 'false');
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/FileDialog',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
