import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="nigeria-national-identification-number-input"\n  type="text"\n  aria-label="National Identification Number (NIN)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Nigeria National Identification Number Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
