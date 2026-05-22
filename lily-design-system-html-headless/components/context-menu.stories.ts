import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="context-menu"
  role="menu"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ContextMenu behavior
  (function() {
    'use strict';
    // ContextMenu: consumer implements interactive behavior
    document.querySelectorAll('.context-menu').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ContextMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
