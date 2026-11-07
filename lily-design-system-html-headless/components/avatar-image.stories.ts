import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<img
  class="avatar-image"
  src=""
  alt=""
  aria-hidden="true"
/>`;

const meta = {
    title: "Headless/AvatarImage",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
