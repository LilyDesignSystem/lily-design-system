import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-input"\n  type="text"\n  aria-label="National Identification Number"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/As Saudiyah Raqm Al Huwiyah Al Wataniyah Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
