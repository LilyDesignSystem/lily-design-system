import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<figure><figcaption class="caption">\n    <!-- Consumer provides child content -->\n</figcaption></figure>';

const meta = {
    title: "Headless/Caption",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
