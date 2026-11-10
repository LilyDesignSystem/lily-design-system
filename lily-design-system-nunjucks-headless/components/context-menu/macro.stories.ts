import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="context-menu"
  role="menu" aria-label="Record actions"></div>`;

const meta = {
    title: "Headless/ContextMenu",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
