import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input"\n  type="text"\n  aria-label="Personal identification number (JShShIR / PINFL)"\n  autocomplete="off"\n  spellcheck="false"\n/>';

const meta = {
    title: "Headless/Ozbekiston Jismoniy Shaxsning Shaxsiy Identifikatsion Raqami Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
