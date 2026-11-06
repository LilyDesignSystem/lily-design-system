import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="skeleton"\n  aria-hidden="true"\n  aria-busy="true"\n>\n  <!-- Consumer provides content -->\n</div>';

const meta = {
    title: "Headless/Skeleton",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
