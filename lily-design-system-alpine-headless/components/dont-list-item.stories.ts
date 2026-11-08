import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ol><li class="dont-list-item" data-recommendation="dont" aria-label="Example">\n    <!-- Consumer provides child content -->\n</li></ol>';

const meta = {
    title: "Headless/Dont List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
