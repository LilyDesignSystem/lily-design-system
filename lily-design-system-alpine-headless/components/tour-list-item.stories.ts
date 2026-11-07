import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ol><li class="tour-list-item" aria-label="Example" data-current>\n    <!-- Consumer provides child content -->\n</li></ol>';

const meta = {
    title: "Headless/Tour List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
