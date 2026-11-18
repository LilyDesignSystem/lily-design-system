import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="sverige-personnummer-view"\n  ><span class="screen-reader-span">Personal Identity Number </span></span\n>';

const meta = {
    title: "Headless/Sverige Personnummer View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
