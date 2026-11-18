import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Personal identification number (JShShIR / PINFL)">`;

const meta = {
    title: "Headless/OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
