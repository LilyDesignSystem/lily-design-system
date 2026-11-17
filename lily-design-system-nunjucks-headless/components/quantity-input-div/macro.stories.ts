import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="quantity-input-div" role="group" aria-label="Weight"><label for="demo-weight-magnitude">Amount</label> <input class="quantity-input-div-magnitude" id="demo-weight-magnitude" name="weight-magnitude" type="number" inputmode="decimal" min="0" max="300" step="0.1"> <label for="demo-weight-unit">Unit</label> <select class="quantity-input-div-unit" id="demo-weight-unit" name="weight-unit"><option value="kg" selected>kilograms</option><option value="[lb_av]">pounds</option></select></div>`;

const meta = {
    title: "Headless/QuantityInputDiv",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
