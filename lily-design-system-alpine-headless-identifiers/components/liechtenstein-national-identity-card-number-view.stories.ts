import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="liechtenstein-national-identity-card-number-view"\n  ><span class="screen-reader-span">Liechtenstein National Identity Card Number </span></span\n>';

const meta = {
    title: "Headless/Liechtenstein National Identity Card Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
