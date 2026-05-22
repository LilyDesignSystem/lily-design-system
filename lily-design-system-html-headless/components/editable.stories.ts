import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="editable"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Editable behavior
  (function() {
    'use strict';
    // Editable: consumer implements interactive behavior
    document.querySelectorAll('.editable').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Editable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
