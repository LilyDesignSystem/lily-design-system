import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="file-manager"
  role="region"
  aria-label="File manager"
  data-module="file-manager"></div>`;

const meta = {
    title: "Headless/FileManager",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
