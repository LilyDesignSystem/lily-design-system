import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="popup"
  aria-label=""
  data-open="false"
>
  <!-- Consumer provides content -->
</div>

<script>
  // Popup behavior
  (function() {
    'use strict';
    // Popup: consumer implements interactive behavior
    document.querySelectorAll('.popup').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Popup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
