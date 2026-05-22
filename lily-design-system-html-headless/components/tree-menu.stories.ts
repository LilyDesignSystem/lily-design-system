import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="tree-menu"
  role="tree"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // TreeMenu behavior
  (function() {
    'use strict';
    // TreeMenu: consumer implements interactive behavior
    document.querySelectorAll('.tree-menu').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TreeMenu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
