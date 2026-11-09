import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<a\n  class="call-to-action"\n  href=""\n>\n  <!-- Consumer provides content -->\n</a>';

const meta = {
    title: "Headless/Call To Action",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
