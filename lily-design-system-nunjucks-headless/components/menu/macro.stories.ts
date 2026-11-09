import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="menu"
  role="menu" aria-label="File"></div>`;

const meta = {
    title: "Headless/Menu",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
