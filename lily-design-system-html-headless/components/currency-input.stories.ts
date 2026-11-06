import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="currency-input"
  type="text"
  inputmode="decimal"
  aria-label=""
  data-currency-code=""
/>

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
    title: "Headless/CurrencyInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
