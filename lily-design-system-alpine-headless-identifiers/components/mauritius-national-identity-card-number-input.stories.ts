import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="mauritius-national-identity-card-number-input"\n  type="text"\n  aria-label="National Identity Card number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Mauritius National Identity Card Number Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
