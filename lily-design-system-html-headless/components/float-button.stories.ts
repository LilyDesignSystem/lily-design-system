import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</button>
-->

<button
  class="float-button"
  type="button"
  aria-label=""
  data-position="bottom-right"
  style="position: fixed; bottom: 1rem; right: 1rem;"
>
  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->
</button>

<script>
  // FloatButton behavior
  // - Ensures type defaults to "button" to avoid accidental form submission.
  // - Respects the disabled attribute when handling clicks.
  (function () {
    "use strict";

    var nodes = document.querySelectorAll('button.float-button');

    nodes.forEach(function (btn) {
      // Default to type="button" so the button does not submit a parent form.
      if (!btn.hasAttribute('type')) {
        btn.setAttribute('type', 'button');
      }

      btn.addEventListener('click', function (e) {
        // If disabled, swallow the event so consumer handlers do not run.
        if (btn.disabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // Otherwise, the consumer's click handler (if any) runs normally.
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/FloatButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
