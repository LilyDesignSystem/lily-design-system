import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="ghana-card-personal-identification-number-input"\n  type="text"\n  aria-label="Ghana Card PIN"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Ghana Card Personal Identification Number Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
