import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="australia-tax-file-number-view"\n  aria-label="Tax File Number (TFN)"\n></span>';

const meta = {
    title: "Headless/Australia Tax File Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
