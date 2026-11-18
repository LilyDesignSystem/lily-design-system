import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="alba-community-health-index-view"\n  ><span class="screen-reader-span">Community Health Index </span></span\n>';

const meta = {
    title: "Headless/Alba Community Health Index View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
