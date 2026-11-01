import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view"\n  aria-label="National Identification Card Number"\n></span>';

const meta = {
    title: "Headless/Taiwan Guomin Shenfenzheng Tongyi Bianhao View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
