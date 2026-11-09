import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="menu-item"
  role="none">
  <button
    class="menu-item-button"
    type="button"
    role="menuitem"  >
    <span class="menu-item-text">New</span>  </button>
</div>`;

const meta = {
    title: "Headless/MenuItem",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
