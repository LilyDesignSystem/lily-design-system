import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<img\n  class="avatar-image"\n  src=""\n  alt=""\n  aria-hidden="true"\n/>';

const meta = {
    title: "Headless/Avatar Image",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
