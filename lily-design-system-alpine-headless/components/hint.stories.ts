import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<p\n  class="hint"\n>\n  <!-- Consumer provides text content -->\n</p>';

const meta = {
    title: "Headless/Hint",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
