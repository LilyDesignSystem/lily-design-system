import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `</div>
-->

<div
  class="tab-panel"
  role="tabpanel"
  aria-label=""
  data-selected="false"
  tabindex="0"
  hidden
>
  <!-- Consumer provides panel content -->
</div>

<script>
  // TabPanel behavior
  // Keeps the \`hidden\` attribute synchronized with the \`data-selected\`
  // attribute so consumers only need to flip data-selected to show/hide
  // the panel. Uses MutationObserver — pure vanilla JavaScript.
  (function () {
    "use strict";

    var panels = document.querySelectorAll('div.tab-panel');

    function syncHidden(panel) {
      var selected = panel.getAttribute('data-selected') === 'true';
      if (selected) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    }

    panels.forEach(function (panel) {
      // Initial sync on load.
      syncHidden(panel);

      // Observe data-selected changes and re-sync the hidden attribute.
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'data-selected') {
            syncHidden(panel);
            break;
          }
        }
      });
      observer.observe(panel, { attributes: true, attributeFilter: ['data-selected'] });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TabPanel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
