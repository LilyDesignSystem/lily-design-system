import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="hong-kong-identity-card-input"\n  type="text"\n  aria-label="Hong Kong Identity Card Number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Hong Kong Identity Card Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
