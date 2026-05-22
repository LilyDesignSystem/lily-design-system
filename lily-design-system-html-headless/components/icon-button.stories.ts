import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="icon-button"
  type="button"
  aria-label=""
>
  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->
</button>

<script>
  // IconButton behavior
  // Wires up minimal interaction:
  //   - Ensures type defaults to "button" (so it does not submit a parent form by accident).
  //   - If the button is configured as a toggle (has aria-pressed), clicking flips the state.
  (function () {
    "use strict";

    // Find every icon-button on the page and attach behavior
    var nodes = document.querySelectorAll('button.icon-button');

    nodes.forEach(function (btn) {
      // Default type to "button" if the consumer did not specify a type.
      // This prevents accidental form submission for icon-only buttons.
      if (!btn.hasAttribute('type')) {
        btn.setAttribute('type', 'button');
      }

      // If the button advertises a toggle role via aria-pressed, manage the state.
      btn.addEventListener('click', function () {
        // Respect disabled state — do nothing if disabled.
        if (btn.disabled) return;

        // If aria-pressed is present, treat as a toggle and flip the value.
        var pressed = btn.getAttribute('aria-pressed');
        if (pressed === 'true' || pressed === 'false') {
          btn.setAttribute('aria-pressed', pressed === 'true' ? 'false' : 'true');
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/IconButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
