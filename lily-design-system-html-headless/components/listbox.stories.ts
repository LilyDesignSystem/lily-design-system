import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="listbox"
  role="listbox"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Listbox behavior
  (function() {
    'use strict';
    // Listbox: consumer implements interactive behavior
    document.querySelectorAll('.listbox').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Listbox',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
