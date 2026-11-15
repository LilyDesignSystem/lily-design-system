import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="five-star-rating-radio-input"\n  type="radio"\n  aria-label=""\n  value=""\n  data-value=""\n/>';

const meta = {
    title: "Headless/Five Star Rating Radio Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
