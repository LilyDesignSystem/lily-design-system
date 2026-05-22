import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="red-amber-green-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // RedAmberGreenPicker behavior
  (function() {
    'use strict';
    // RedAmberGreenPicker: consumer implements interactive behavior
    document.querySelectorAll('.red-amber-green-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/RedAmberGreenPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
