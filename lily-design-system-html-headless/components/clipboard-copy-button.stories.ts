import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="clipboard-copy-button"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>

<script>
  // ClipboardCopyButton behavior
  (function() {
    'use strict';
    document.querySelectorAll('.clipboard-copy-button').forEach(function(el) {
      el.addEventListener('click', function() {
        var text = el.getAttribute('data-clipboard-text') || el.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function() {
            el.setAttribute('data-copied', 'true');
          });
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ClipboardCopyButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
