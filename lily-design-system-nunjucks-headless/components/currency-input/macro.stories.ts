import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="currency-input"
  type="text"
  inputmode="decimal" data-currency-code="EUR"  value="" id="price" aria-label="Price">`;

const meta = {
    title: "Headless/CurrencyInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
