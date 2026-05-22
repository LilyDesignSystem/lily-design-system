import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="menu-bar"
  role="menubar"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // MenuBar behavior
  (function() {
    'use strict';
    document.querySelectorAll('.menu-bar').forEach(function(bar) {
      var items = bar.querySelectorAll('[role="menuitem"]');
      bar.addEventListener('keydown', function(e) {
        var index = Array.from(items).indexOf(document.activeElement);
        if (index < 0) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          items[(index + 1) % items.length].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          items[(index - 1 + items.length) % items.length].focus();
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/MenuBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
