import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="sri-lanka-national-identity-card-input"\n  type="text"\n  aria-label="National Identity Card (NIC) number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Sri Lanka National Identity Card Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
