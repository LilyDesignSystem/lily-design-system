import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="toggle-group"
  role="group"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ToggleGroup behavior
  (function() {
    'use strict';
    // ToggleGroup: consumer implements interactive behavior
    document.querySelectorAll('.toggle-group').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ToggleGroup',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
