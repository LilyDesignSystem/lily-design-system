import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="mockup-laptop">
  <div class="mockup-laptop-chrome" aria-hidden="true">  </div>
  <div class="mockup-laptop-body"></div>
</div>`;

const meta = {
    title: "Headless/MockupLaptop",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
