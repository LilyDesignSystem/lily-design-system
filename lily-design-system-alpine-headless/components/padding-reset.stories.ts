import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<div class="padding-reset">\n  <!-- Consumer provides content -->\n</div>';

const meta = {
    title: "Headless/Padding Reset",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
