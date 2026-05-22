import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="color-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ColorPicker behavior
  (function() {
    'use strict';
    // ColorPicker: consumer implements interactive behavior
    document.querySelectorAll('.color-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ColorPicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
