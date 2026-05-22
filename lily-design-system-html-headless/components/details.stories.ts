import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<details
  class="details"
  aria-label=""
>
  <!-- Consumer provides content -->
</details>

<script>
  // Details behavior
  (function() {
    'use strict';
    // Details: consumer implements interactive behavior
    document.querySelectorAll('.details').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Details',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
