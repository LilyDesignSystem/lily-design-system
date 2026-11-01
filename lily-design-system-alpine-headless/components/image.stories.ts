import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<img\n  class="image"\n  src=""\n  alt=""\n/>';

const meta = {
    title: "Headless/Image",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
