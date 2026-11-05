import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="hamburger-menu">
  <button
    class="hamburger-menu-button"
    type="button"
    aria-label="Main menu"
    aria-expanded="true"
    aria-controls="hamburger-menu-nav"
  >
    <span class="hamburger-menu-icon" aria-hidden="true"></span>
  </button>
  <nav class="hamburger-menu-nav" id="hamburger-menu-nav" aria-label="Main menu">
    <a href="#">Home</a>
  </nav>
</div>`;

const meta = {
    title: "Headless/HamburgerMenu",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
