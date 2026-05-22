import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="theme-picker"
  role="radiogroup"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // ThemePicker behavior
  (function() {
    'use strict';
    // ThemePicker: consumer implements interactive behavior
    document.querySelectorAll('.theme-picker').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ThemePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
