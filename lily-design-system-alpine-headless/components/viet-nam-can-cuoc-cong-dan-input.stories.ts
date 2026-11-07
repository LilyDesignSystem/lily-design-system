import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="viet-nam-can-cuoc-cong-dan-input"\n  type="text"\n  aria-label="Citizen Identification Number (CCCD)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Viet Nam Can Cuoc Cong Dan Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
