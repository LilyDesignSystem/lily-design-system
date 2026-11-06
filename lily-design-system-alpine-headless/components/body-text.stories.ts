import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<div class="body-text">\n  <!-- Consumer provides content -->\n</div>';

const meta = {
    title: "Headless/Body Text",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
