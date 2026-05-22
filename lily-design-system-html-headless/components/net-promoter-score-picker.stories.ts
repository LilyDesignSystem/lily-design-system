import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="net-promoter-score-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // NetPromoterScorePicker behavior
  (function() {
    'use strict';
    // NetPromoterScorePicker: consumer implements interactive behavior
    document.querySelectorAll('.net-promoter-score-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/NetPromoterScorePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
