import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<aside
  class="sticky-promo-banner"
  role="complementary"
  aria-label=""
  data-position="bottom"
  style="position: fixed; left: 0; right: 0; bottom: 0;"
>
  <div class="sticky-promo-banner-content">
    <!-- Consumer provides banner content -->
  </div>
  <button
    type="button"
    class="sticky-promo-banner-dismiss"
    aria-label=""
  >&times;</button>
</aside>

<script>
  // StickyPromoBanner behavior
  // Wires up minimal interaction:
  //   - Clicking the dismiss button toggles the hidden attribute on the
  //     root <aside>, hiding the banner.
  //   - Updates the inline style top/bottom anchor in response to a
  //     change of the data-position attribute, so consumers can switch
  //     position dynamically.
  (function () {
    "use strict";

    // Ensure the inline style top/bottom matches the data-position attribute.
    function applyPosition(banner) {
      var pos = banner.getAttribute('data-position') || 'bottom';
      // Reset both anchors and apply the chosen one.
      banner.style.top = '';
      banner.style.bottom = '';
      banner.style.position = 'fixed';
      banner.style.left = '0';
      banner.style.right = '0';
      if (pos === 'top') {
        banner.style.top = '0';
      } else {
        banner.style.bottom = '0';
      }
    }

    // Initialize every banner on the page.
    var banners = document.querySelectorAll('aside.sticky-promo-banner');
    banners.forEach(function (banner) {
      applyPosition(banner);

      // Dismiss button toggles the hidden attribute on the root <aside>.
      var dismiss = banner.querySelector('.sticky-promo-banner-dismiss');
      if (dismiss) {
        dismiss.addEventListener('click', function () {
          banner.setAttribute('hidden', '');
        });
      }

      // Observe data-position changes so consumers can switch sides at runtime.
      var observer = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].attributeName === 'data-position') {
            applyPosition(banner);
            break;
          }
        }
      });
      observer.observe(banner, { attributes: true, attributeFilter: ['data-position'] });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/StickyPromoBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
