import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="malaysia-kad-pengenalan-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="MyKad Number (NRIC)">`;

const meta = {
    title: "Headless/MalaysiaKadPengenalanInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
