import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="toggle-button"
  aria-label=""
  aria-pressed="false"
>
  <!-- Consumer provides button content -->
</button>

<script>
  // ToggleButton behavior
  (function() {
    'use strict';
    document.querySelectorAll('.toggle-button').forEach(function(el) {
      el.addEventListener('click', function() {
        var pressed = el.getAttribute('aria-pressed') === 'true';
        el.setAttribute('aria-pressed', String(!pressed));
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/ToggleButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
