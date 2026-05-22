import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="coachmark"
  role="dialog"
  aria-modal="false"
  aria-labelledby="coachmark-title-1"
  aria-describedby="coachmark-desc-1"
>
  <h2 class="coachmark-title" id="coachmark-title-1"></h2>
  <p class="coachmark-description" id="coachmark-desc-1"></p>
  <button class="coachmark-dismiss" type="button" aria-label="">×</button>
</div>

<script>
  // Coachmark behavior
  // Wires each coachmark's dismiss button to hide the coachmark via the
  // \`hidden\` attribute. Pure vanilla JavaScript — no framework, no styling.
  (function () {
    "use strict";

    var coachmarks = document.querySelectorAll('div.coachmark');

    coachmarks.forEach(function (coachmark) {
      var dismiss = coachmark.querySelector('.coachmark-dismiss');
      if (!dismiss) return;

      dismiss.addEventListener('click', function () {
        if (dismiss.disabled) return;
        // Hide the coachmark dialog.
        coachmark.setAttribute('hidden', '');
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Coachmark',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
