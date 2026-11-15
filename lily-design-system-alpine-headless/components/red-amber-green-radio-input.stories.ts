import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="red-amber-green-radio-input"\n  type="radio"\n  aria-label=""\n  value=""\n  data-value=""\n/>';

const meta = {
    title: "Headless/Red Amber Green Radio Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
