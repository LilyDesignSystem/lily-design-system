import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="hamburger-menu">
  <button
    class="hamburger-menu-button"
    type="button"
    aria-label="Main menu"
    aria-expanded="false"
    aria-controls="hamburger-menu-nav-1"
  >
    Menu
  </button>
  <nav
    class="hamburger-menu-nav"
    id="hamburger-menu-nav-1"
    aria-label="Main menu"
    hidden
  >
    <a href="#">Home</a>
  </nav>
</div>

<script>
  // HamburgerMenu behavior
  (function() {
    'use strict';
    document.querySelectorAll('.hamburger-menu').forEach(function(el) {
      var button = el.querySelector('.hamburger-menu-button');
      var nav = el.querySelector('.hamburger-menu-nav');
      if (!button || !nav) return;
      button.addEventListener('click', function() {
        var open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        nav.hidden = !open;
      });
    });
  })();
</script>`;

const meta = {
    title: "Headless/HamburgerMenu",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
