import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="australia-tax-file-number-input"\n  type="text"\n  aria-label="Tax File Number (TFN)"\n  autocomplete="off"\n/>';

const meta = {
    title: "Headless/Australia Tax File Number Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
