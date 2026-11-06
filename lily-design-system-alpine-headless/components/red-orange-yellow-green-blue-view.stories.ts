import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="red-orange-yellow-green-blue-view">\n  <!-- Consumer provides text content -->\n</span>';

const meta = {
    title: "Headless/Red Orange Yellow Green Blue View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
