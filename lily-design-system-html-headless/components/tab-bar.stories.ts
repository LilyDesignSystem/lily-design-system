import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tab-bar"
  role="tablist"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // TabBar behavior
  (function() {
    'use strict';
    document.querySelectorAll('.tab-bar').forEach(function(tabBar) {
      var tabs = tabBar.querySelectorAll('[role="tab"]');
      tabBar.addEventListener('keydown', function(e) {
        var index = Array.from(tabs).indexOf(document.activeElement);
        if (index < 0) return;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          tabs[(index + 1) % tabs.length].focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          tabs[(index - 1 + tabs.length) % tabs.length].focus();
        }
      });
      tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
          tabs.forEach(function(t) {
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
          });
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
        });
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TabBar',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
