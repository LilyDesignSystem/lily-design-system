import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
    </div>
-->

<div
  class="cascader"
  role="combobox"
  aria-haspopup="tree"
  aria-expanded="false"
  aria-label=""
>
  <!-- Trigger button: opens and closes the panel -->
  <button class="cascader-trigger" type="button">
    <!-- Consumer provides the display value or placeholder text -->
  </button>

  <!-- Panel: holds the hierarchical option list. Hidden until expanded. -->
  <div class="cascader-panel" hidden>
    <!-- Consumer provides the cascading option lists -->
  </div>
</div>

<script>
  // Cascader behavior
  // Wires up the trigger button to toggle the panel and aria-expanded.
  (function () {
    "use strict";

    // Find every cascader on the page and attach behavior to each.
    var roots = document.querySelectorAll('div.cascader');

    roots.forEach(function (root) {
      var trigger = root.querySelector('.cascader-trigger');
      var panel = root.querySelector('.cascader-panel');
      if (!trigger || !panel) return;

      // Click on the trigger toggles the panel and aria-expanded.
      trigger.addEventListener('click', function () {
        // Respect disabled state on the trigger.
        if (trigger.disabled) return;

        // Read current state from aria-expanded; default to "false".
        var expanded = root.getAttribute('aria-expanded') === 'true';
        var next = !expanded;

        // Update ARIA state on the combobox root.
        root.setAttribute('aria-expanded', next ? 'true' : 'false');

        // Show/hide the panel via the hidden attribute.
        if (next) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

      // Pressing Escape on the trigger closes the panel.
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && root.getAttribute('aria-expanded') === 'true') {
          root.setAttribute('aria-expanded', 'false');
          panel.setAttribute('hidden', '');
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Cascader',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
