import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button class="action-group-overflow-trigger" type="button"
              aria-haspopup="menu" aria-expanded="false"
              aria-controls="action-group-overflow-1"
              aria-label="More actions">…</button>
      <div class="action-group-overflow-menu" id="action-group-overflow-1" hidden>
        <!-- overflow menu content -->
      </div>
    </div>
-->

<div
  class="action-group"
  role="group"
  aria-label=""
>
  <!-- Consumer inserts visible action buttons here -->

  <button
    class="action-group-overflow-trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="action-group-overflow-1"
    aria-label=""
  >…</button>

  <div
    class="action-group-overflow-menu"
    id="action-group-overflow-1"
    hidden
  >
    <!-- Consumer provides overflow menu content -->
  </div>
</div>

<script>
  // ActionGroup behavior
  // Wires the overflow trigger to toggle aria-expanded and the panel's hidden
  // attribute. Pure vanilla JavaScript — no framework, no styling.
  (function () {
    "use strict";

    var groups = document.querySelectorAll('div.action-group');

    groups.forEach(function (group) {
      var trigger = group.querySelector('.action-group-overflow-trigger');
      if (!trigger) return;

      // The panel is referenced by aria-controls; fall back to a sibling lookup.
      var panel = null;
      var controlsId = trigger.getAttribute('aria-controls');
      if (controlsId) {
        panel = group.querySelector('#' + controlsId) ||
                document.getElementById(controlsId);
      }
      if (!panel) {
        panel = group.querySelector('.action-group-overflow-menu');
      }
      if (!panel) return;

      trigger.addEventListener('click', function () {
        if (trigger.disabled) return;

        // Toggle aria-expanded.
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var next = !expanded;
        trigger.setAttribute('aria-expanded', next ? 'true' : 'false');

        // Toggle the panel's hidden attribute to match.
        if (next) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ActionGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
