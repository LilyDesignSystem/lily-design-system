import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="malaysia-kad-pengenalan-input"\n  type="text"\n  aria-label="MyKad Number (NRIC)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Malaysia Kad Pengenalan Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
