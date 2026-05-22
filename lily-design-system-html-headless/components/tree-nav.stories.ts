import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<nav
  class="tree-nav"
  aria-label=""
>
  <!-- Consumer provides navigation list -->
</nav>

<script>
  // TreeNav behavior
  (function() {
    'use strict';
    // TreeNav: consumer implements interactive behavior
    document.querySelectorAll('.tree-nav').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/TreeNav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
