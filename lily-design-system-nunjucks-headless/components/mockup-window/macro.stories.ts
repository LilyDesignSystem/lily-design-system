import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="mockup-window">
  <div class="mockup-window-chrome" aria-hidden="true">  </div>
  <div class="mockup-window-body"></div>
</div>`;

const meta = {
    title: "Headless/MockupWindow",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
