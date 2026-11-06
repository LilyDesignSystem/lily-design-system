import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="zhongguo-jumin-shenfenzheng-haoma-view"\n  ><span class="screen-reader-span">居民身份证号码 (Jūmín Shēnfènzhèng Hàomǎ) </span></span\n>';

const meta = {
    title: "Headless/Zhongguo Jumin Shenfenzheng Haoma View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
