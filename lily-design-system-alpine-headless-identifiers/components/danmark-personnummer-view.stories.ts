import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="danmark-personnummer-view"\n  ><span class="screen-reader-span">Personal Identity Code </span></span\n>';

const meta = {
    title: "Headless/Danmark Personnummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
