import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<dialog
  class="sheet"
  open
  aria-label="Sheet"><!-- shown with open so the story is visible; open it with showModal() --></dialog>`;

const meta = {
    title: "Headless/Sheet",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
