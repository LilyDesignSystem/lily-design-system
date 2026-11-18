import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="mauritius-national-identity-card-number-view"\n  ><span class="screen-reader-span">National Identity Card number </span></span\n>';

const meta = {
    title: "Headless/Mauritius National Identity Card Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
