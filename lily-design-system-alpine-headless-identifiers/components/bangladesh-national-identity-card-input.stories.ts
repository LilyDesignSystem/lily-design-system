import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="bangladesh-national-identity-card-input"\n  type="text"\n  aria-label="National ID (NID) number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Bangladesh National Identity Card Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
