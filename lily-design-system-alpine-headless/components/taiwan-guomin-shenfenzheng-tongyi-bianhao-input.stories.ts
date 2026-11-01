import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<input\n  class="taiwan-guomin-shenfenzheng-tongyi-bianhao-input"\n  type="text"\n  aria-label="National Identification Card Number"\n  autocomplete="off"\n/>';

const meta = {
    title: "Headless/Taiwan Guomin Shenfenzheng Tongyi Bianhao Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
