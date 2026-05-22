import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<button
  class="switch-button"
  role="switch"
  aria-label=""
  aria-checked="false"
>
  <!-- Consumer provides button content -->
</button>

<script>
  // SwitchButton behavior
  (function() {
    'use strict';
    document.querySelectorAll('.switch-button').forEach(function(el) {
      el.addEventListener('click', function() {
        var pressed = el.getAttribute('aria-checked') === 'true';
        el.setAttribute('aria-checked', String(!pressed));
      });
      el.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          el.click();
        }
      });
    });
  })();
</script>`;

const meta = {
  title: 'Headless/SwitchButton',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
