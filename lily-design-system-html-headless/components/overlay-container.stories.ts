import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
-->

<div
  class="overlay-container"
  role="presentation"
  data-open="false"
  aria-hidden="true"
  hidden
>
  <!-- Consumer provides the overlay child (typically a dialog or sheet) -->
</div>

<script>
  // OverlayContainer behavior
  // Keeps the data-open state, the aria-hidden attribute, and the hidden
  // attribute in sync. Provides a programmatic API and a backdrop-click
  // event so consumers can drive the open/close lifecycle declaratively.
  (function () {
    "use strict";

    var overlays = document.querySelectorAll('div.overlay-container');

    overlays.forEach(function (overlay) {
      // Sync ARIA + hidden attribute from the data-open state.
      // Call this whenever data-open is mutated externally.
      function syncFromDataOpen() {
        var isOpen = overlay.getAttribute('data-open') === 'true';
        overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        if (isOpen) {
          overlay.removeAttribute('hidden');
        } else {
          overlay.setAttribute('hidden', '');
        }
      }

      // Public-ish helpers attached to the element so consumers can call them.
      overlay.openOverlay = function () {
        overlay.setAttribute('data-open', 'true');
        syncFromDataOpen();
      };
      overlay.closeOverlay = function () {
        overlay.setAttribute('data-open', 'false');
        syncFromDataOpen();
      };

      // Dispatch a "close" CustomEvent if the user clicks the backdrop itself
      // (not a child). Consumers may listen and call closeOverlay().
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
          overlay.dispatchEvent(new CustomEvent('overlay-close', { bubbles: true }));
        }
      });

      // Watch for external mutations to data-open and re-sync.
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          if (m.attributeName === 'data-open') syncFromDataOpen();
        });
      });
      observer.observe(overlay, { attributes: true, attributeFilter: ['data-open'] });

      // Initial sync to ensure attributes match the starting data-open value.
      syncFromDataOpen();
    });
  })();
</script>`;

const meta = {
  title: 'Headless/OverlayContainer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
