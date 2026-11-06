import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view"\n  ><span class="screen-reader-span">National Identification Card Number </span></span\n>';

const meta = {
    title: "Headless/Taiwan Guomin Shenfenzheng Tongyi Bianhao View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
