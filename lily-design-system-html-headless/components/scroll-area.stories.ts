import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroll-area"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ScrollArea behavior
  (function() {
    'use strict';
    // ScrollArea: consumer implements interactive behavior
    document.querySelectorAll('.scroll-area').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ScrollArea',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
