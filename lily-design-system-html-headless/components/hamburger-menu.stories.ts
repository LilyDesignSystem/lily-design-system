import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="hamburger-menu"
  aria-label=""
>
  <!-- Consumer provides button content -->
</button>

<script>
  // HamburgerMenu behavior
  (function() {
    'use strict';
    document.querySelectorAll('.hamburger-menu').forEach(function(el) {
      el.addEventListener('click', function() {
        var expanded = el.getAttribute('aria-expanded') === 'true';
        el.setAttribute('aria-expanded', String(!expanded));
        var target = document.getElementById(el.getAttribute('aria-controls'));
        if (target) {
          target.setAttribute('aria-hidden', String(expanded));
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/HamburgerMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
