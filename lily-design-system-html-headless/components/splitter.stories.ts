import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="splitter"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // Splitter behavior
  (function() {
    'use strict';
    // Splitter: consumer implements interactive behavior
    document.querySelectorAll('.splitter').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Splitter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
