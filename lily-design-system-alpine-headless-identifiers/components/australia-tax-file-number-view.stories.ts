import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="australia-tax-file-number-view"\n  ><span class="screen-reader-span">Tax File Number (TFN) </span></span\n>';

const meta = {
    title: "Headless/Australia Tax File Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
