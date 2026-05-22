import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="combobox"
  role="combobox"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Combobox behavior
  (function() {
    'use strict';
    // Combobox: consumer implements interactive behavior
    document.querySelectorAll('.combobox').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Combobox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
