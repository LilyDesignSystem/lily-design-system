import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view"
  aria-label="Personal identification number (JShShIR / PINFL)"
>sample-value</span>`;

const meta = {
    title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
