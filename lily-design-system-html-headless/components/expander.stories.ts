import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="expander"
  aria-label=""
  data-expanded="false"
>
  <!-- Consumer provides content -->
</div>

<script>
  // Expander behavior
  (function() {
    'use strict';
    document.querySelectorAll('.expander').forEach(function(el) {
      var trigger = el.querySelector('[data-trigger]');
      var content = el.querySelector('[data-content]');
      if (trigger && content) {
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
        trigger.addEventListener('click', function() {
          var expanded = trigger.getAttribute('aria-expanded') === 'true';
          trigger.setAttribute('aria-expanded', String(!expanded));
          content.setAttribute('aria-hidden', String(expanded));
          el.setAttribute('data-expanded', String(!expanded));
        });
      }
    });
  })();
</script>`;

const meta = {
  title: 'Headless/Expander',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
