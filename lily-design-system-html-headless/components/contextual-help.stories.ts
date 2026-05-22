import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
    </div>
-->

<div class="contextual-help">
  <button
    class="contextual-help-trigger"
    type="button"
    aria-label=""
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="contextual-help-panel-1"
  >?</button>

  <div
    class="contextual-help-panel"
    id="contextual-help-panel-1"
    role="dialog"
    hidden
  >
    <!-- Consumer provides popover content -->
  </div>
</div>

<script>
  // ContextualHelp behavior
  // Wires each trigger to toggle aria-expanded on itself and the \`hidden\`
  // attribute on the referenced panel. Pure vanilla JavaScript.
  (function () {
    "use strict";

    var roots = document.querySelectorAll('div.contextual-help');

    roots.forEach(function (root) {
      var trigger = root.querySelector('.contextual-help-trigger');
      if (!trigger) return;

      var panel = null;
      var controlsId = trigger.getAttribute('aria-controls');
      if (controlsId) {
        panel = root.querySelector('#' + controlsId) ||
                document.getElementById(controlsId);
      }
      if (!panel) {
        panel = root.querySelector('.contextual-help-panel');
      }
      if (!panel) return;

      trigger.addEventListener('click', function () {
        if (trigger.disabled) return;

        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var next = !expanded;
        trigger.setAttribute('aria-expanded', next ? 'true' : 'false');

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
  title: 'Headless/ContextualHelp',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
