import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="tour"
  role="dialog"
  tabindex="-1" aria-label="Tour"></div>`;

const meta = {
    title: "Headless/Tour",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
