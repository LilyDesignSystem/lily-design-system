import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="quantity-input-div"\n  role="group"\n  aria-label="Weight"\n>\n  <label for="weight-magnitude">Amount</label>\n  <input\n    class="quantity-input-div-magnitude"\n    id="weight-magnitude"\n    name="weight-magnitude"\n    type="number"\n    inputmode="decimal"\n    min="0"\n    max="300"\n    step="0.1"\n  />\n  <label for="weight-unit">Unit</label>\n  <select\n    class="quantity-input-div-unit"\n    id="weight-unit"\n    name="weight-unit"\n  >\n    <option\n      value="kg"\n      data-min="0"\n      data-max="300"\n      data-step="0.1"\n      selected\n    >\n      kilograms\n    </option>\n    <option\n      value="[lb_av]"\n      data-min="0"\n      data-max="660"\n      data-step="0.1"\n    >\n      pounds\n    </option>\n  </select>\n</div>';

const meta = {
    title: "Headless/Quantity Input Div",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
