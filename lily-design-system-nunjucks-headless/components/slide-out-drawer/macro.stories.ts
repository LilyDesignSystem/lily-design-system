import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<dialog
  class="slide-out-drawer"
  open
  aria-label="Drawer"><!-- shown with open so the story is visible; open it with showModal() --></dialog>`;

const meta = {
    title: "Headless/SlideOutDrawer",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
