import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="theme-select"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ThemeSelect behavior
  (function() {
    'use strict';
    // ThemeSelect: consumer implements interactive behavior
    document.querySelectorAll('.theme-select').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ThemeSelect',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
