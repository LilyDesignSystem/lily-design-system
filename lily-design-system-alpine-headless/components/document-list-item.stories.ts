import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<li class="document-list-item">\n  <!-- Consumer provides content -->\n</li>';

const meta = {
    title: "Headless/Document List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
