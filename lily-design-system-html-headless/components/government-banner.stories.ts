import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="government-banner"
  aria-label=""
>
  <header class="government-banner-header">
    <span class="government-banner-text"><!-- Consumer-provided headerText --></span>
    <button
      type="button"
      class="government-banner-toggle"
      aria-expanded="false"
      aria-controls="government-banner-panel-1"
    >
      <!-- Consumer-provided expandLabel -->
    </button>
  </header>

  <div
    id="government-banner-panel-1"
    class="government-banner-details"
    hidden
  >
    <!-- Consumer-provided details panel content -->
  </div>
</aside>

<script>
  // GovernmentBanner behavior
  // Wires the toggle button on every government-banner instance:
  //   - Click flips aria-expanded between "true" and "false"
  //   - Click toggles the \`hidden\` attribute on the controlled panel
  // Stable panel id is read from aria-controls on the button.
  (function () {
    "use strict";

    var banners = document.querySelectorAll('aside.government-banner');

    banners.forEach(function (banner) {
      var toggle = banner.querySelector('button.government-banner-toggle');
      if (!toggle) return;

      // Resolve the panel via aria-controls; fall back to the .government-banner-details inside this banner.
      var panelId = toggle.getAttribute('aria-controls');
      var panel = panelId
        ? document.getElementById(panelId)
        : banner.querySelector('.government-banner-details');
      if (!panel) return;

      // Initialize hidden state to match aria-expanded so they stay in sync.
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }

      toggle.addEventListener('click', function () {
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        var next = !isExpanded;
        toggle.setAttribute('aria-expanded', next ? 'true' : 'false');
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
  title: 'Headless/GovernmentBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
