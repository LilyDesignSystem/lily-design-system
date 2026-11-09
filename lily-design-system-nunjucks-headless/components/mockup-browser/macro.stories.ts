import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="mockup-browser">
  <div class="mockup-browser-chrome" aria-hidden="true">  </div>
  <div class="mockup-browser-body"></div>
</div>`;

const meta = {
    title: "Headless/MockupBrowser",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
