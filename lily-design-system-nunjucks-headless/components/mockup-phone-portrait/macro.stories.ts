import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="mockup-phone-portrait">
  <div class="mockup-phone-chrome" aria-hidden="true">  </div>
  <div class="mockup-phone-body"></div>
</div>`;

const meta = {
    title: "Headless/MockupPhonePortrait",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
