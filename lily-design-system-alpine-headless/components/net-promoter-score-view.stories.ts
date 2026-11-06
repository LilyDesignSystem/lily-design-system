import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="net-promoter-score-view">\n  <!-- Consumer provides text content -->\n</span>';

const meta = {
    title: "Headless/Net Promoter Score View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
