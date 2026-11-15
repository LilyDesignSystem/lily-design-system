import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="red-orange-yellow-green-blue-radio-input"\n  type="radio"\n  aria-label=""\n  value=""\n  data-value=""\n/>';

const meta = {
    title: "Headless/Red Orange Yellow Green Blue Radio Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
