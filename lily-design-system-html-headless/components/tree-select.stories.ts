import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
    </div>
-->

<div
  class="tree-select"
  role="combobox"
  aria-haspopup="tree"
  aria-expanded="false"
  aria-label=""
>
  <!-- Trigger button: opens and closes the tree panel. -->
  <button class="tree-select-trigger" type="button">
    <!-- Consumer provides the display value or placeholder text -->
  </button>

  <!-- Tree panel: holds the hierarchical selection. Hidden until expanded. -->
  <div class="tree-select-panel" hidden>
    <!-- Consumer provides the tree (typically a TreeNav with TreeList) -->
  </div>
</div>

<script>
  // TreeSelect behavior
  // - Trigger button toggles the panel open/closed and updates aria-expanded.
  // - Escape on the trigger closes the panel.
  (function () {
    "use strict";

    var roots = document.querySelectorAll('div.tree-select');

    roots.forEach(function (root) {
      var trigger = root.querySelector('.tree-select-trigger');
      var panel = root.querySelector('.tree-select-panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        // Respect disabled.
        if (trigger.disabled) return;

        var expanded = root.getAttribute('aria-expanded') === 'true';
        var next = !expanded;

        root.setAttribute('aria-expanded', next ? 'true' : 'false');

        if (next) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });

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
  title: 'Headless/TreeSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
