import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="dropdown-menu"
  role="menu"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // DropdownMenu behavior
  (function() {
    'use strict';
    // DropdownMenu: consumer implements interactive behavior
    document.querySelectorAll('.dropdown-menu').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/DropdownMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
