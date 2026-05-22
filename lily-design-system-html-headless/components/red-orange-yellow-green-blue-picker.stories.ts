import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="red-orange-yellow-green-blue-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // RedOrangeYellowGreenBluePicker behavior
  (function() {
    'use strict';
    // RedOrangeYellowGreenBluePicker: consumer implements interactive behavior
    document.querySelectorAll('.red-orange-yellow-green-blue-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/RedOrangeYellowGreenBluePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
