import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="currency-input">
  <span class="currency-input-symbol" aria-hidden="true">£</span>
  <input
    class="currency-input-value"
    type="text"
    inputmode="decimal"
    pattern="[0-9]*\\.?[0-9]*"
    value=""  >
</div>`;

const meta = {
  title: 'Headless/CurrencyInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
