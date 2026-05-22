import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
    </div>
-->

<div
  class="split-button"
  role="group"
  aria-label=""
>
  <!-- Primary action button — consumer provides the visible label text -->
  <button
    class="split-button-primary"
    type="button"
  >
    <!-- Consumer provides primary label text -->
  </button>

  <!-- Menu trigger — consumer provides any glyph or icon as inner content (or leaves empty) -->
  <button
    class="split-button-menu-trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-label=""
  >
    <!-- Consumer optionally provides a chevron icon -->
  </button>

  <!-- Menu container — toggled visible when the trigger is pressed -->
  <div
    class="split-button-menu"
    hidden
  >
    <!-- Consumer provides menu items (typically a Menu component) -->
  </div>
</div>

<script>
  // SplitButton behavior
  // Manages the open/closed state of the menu by:
  //   - Toggling on trigger click.
  //   - Closing on Escape (returning focus to the trigger).
  //   - Closing on outside click.
  // The aria-expanded attribute on the trigger and the hidden attribute on
  // the menu are kept in sync.
  (function () {
    "use strict";

    var groups = document.querySelectorAll('div.split-button');

    groups.forEach(function (group) {
      // Locate the trigger and the menu container within this group.
      var trigger = group.querySelector('.split-button-menu-trigger');
      var menu = group.querySelector('.split-button-menu');
      if (!trigger || !menu) return;

      // Apply the open/closed state to both ARIA and the hidden attribute.
      function setOpen(isOpen) {
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (isOpen) {
          menu.removeAttribute('hidden');
        } else {
          menu.setAttribute('hidden', '');
        }
      }

      // Click on the trigger toggles the menu.
      trigger.addEventListener('click', function () {
        if (trigger.disabled) return;
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';
        setOpen(!isOpen);
      });

      // Escape closes the menu and returns focus to the trigger.
      group.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          if (trigger.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            trigger.focus();
          }
        }
      });

      // Click outside the group closes the menu.
      document.addEventListener('click', function (event) {
        if (!group.contains(event.target)) {
          if (trigger.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
          }
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/SplitButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
