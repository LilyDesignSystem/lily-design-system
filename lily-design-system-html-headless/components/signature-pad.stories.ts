import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="signature-pad"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // SignaturePad behavior
  (function() {
    'use strict';
    // SignaturePad: consumer implements interactive behavior
    document.querySelectorAll('.signature-pad').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/SignaturePad',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
