import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="malaysia-kad-pengenalan-view"
  aria-label="MyKad Number (NRIC)"
>sample-value</span>`;

const meta = {
    title: "Headless/MalaysiaKadPengenalanView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
