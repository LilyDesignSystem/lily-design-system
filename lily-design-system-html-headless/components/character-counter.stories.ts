import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<span
  class="character-counter"
  aria-label=""
>
  <!-- Consumer provides text content -->
</span>

<script>
  // CharacterCounter behavior
  (function() {
    'use strict';
    document.querySelectorAll('.character-counter').forEach(function(el) {
      el.setAttribute('aria-live', 'polite');
    });
  })();
</script>`;

const meta = {
  title: 'Headless/CharacterCounter',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
