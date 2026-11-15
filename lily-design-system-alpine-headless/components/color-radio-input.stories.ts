import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="color-radio-input"\n  type="radio"\n  aria-label=""\n  value=""\n  data-color=""\n  style="--color-radio-input-color: "\n/>';

const meta = {
    title: "Headless/Color Radio Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
