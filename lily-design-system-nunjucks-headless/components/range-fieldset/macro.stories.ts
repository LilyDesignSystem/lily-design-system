import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset class="range-fieldset">
  <legend class="range-fieldset-legend">Price</legend>
  <input class="range-fieldset-minimum" type="range" aria-label="Lowest price" name="price-min" min="0" max="100" step="1" value="20">
  <input class="range-fieldset-maximum" type="range" aria-label="Highest price" name="price-max" min="0" max="100" step="1" value="80">
</fieldset>`;

const meta = {
    title: "Headless/RangeFieldset",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
