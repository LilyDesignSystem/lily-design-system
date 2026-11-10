import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="measurement-unit-input"
  type="text"
  value="" id="unit" aria-label="Unit">`;

const meta = {
    title: "Headless/MeasurementUnitInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
