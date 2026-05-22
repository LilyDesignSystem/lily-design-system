import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="medical-banner"
  role="region"
  aria-live="polite"
  aria-label=""
  data-type="info"
  data-context="medical"
>
  <!-- Consumer provides content -->
</div>

<script>
  // MedicalBanner behavior
  (function() {
    'use strict';
    document.querySelectorAll('.medical-banner').forEach(function(el) {
      var dismissBtn = el.querySelector('[data-dismiss]');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', function() {
          el.style.display = 'none';
          el.dispatchEvent(new Event('close', { bubbles: true }));
        });
      }
    });
  })();
</script>`;

const meta = {
  title: 'Headless/MedicalBanner',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
