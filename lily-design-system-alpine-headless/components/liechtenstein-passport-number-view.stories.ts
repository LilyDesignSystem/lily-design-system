import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="liechtenstein-passport-number-view"\n  ><span class="screen-reader-span">Liechtenstein Passport Number </span></span\n>';

const meta = {
    title: "Headless/Liechtenstein Passport Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
