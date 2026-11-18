import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="hong-kong-identity-card-view"\n  ><span class="screen-reader-span">Hong Kong Identity Card Number </span></span\n>';

const meta = {
    title: "Headless/Hong Kong Identity Card View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
