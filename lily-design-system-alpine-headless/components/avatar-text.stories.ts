import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="avatar-text"\n  aria-hidden="true"\n>\n  <!-- Consumer provides content -->\n</span>';

const meta = {
    title: "Headless/Avatar Text",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
