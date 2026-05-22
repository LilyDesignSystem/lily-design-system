import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="currency-input"
  aria-label=""
>
  <!-- Consumer provides content -->
</div>

<script>
  // CurrencyInput behavior
  (function() {
    'use strict';
    // CurrencyInput: consumer implements interactive behavior
    document.querySelectorAll('.currency-input').forEach(function(el) {
      // Interactive behavior initialization
    });
  })();
</script>`;

const meta = {
  title: 'Headless/CurrencyInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
