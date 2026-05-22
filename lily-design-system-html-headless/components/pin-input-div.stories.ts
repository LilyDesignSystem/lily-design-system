import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="pin-input-div"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // PinInputDiv behavior
  (function() {
    'use strict';
    // PinInputDiv: consumer implements interactive behavior
    document.querySelectorAll('.pin-input-div').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/PinInputDiv',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
