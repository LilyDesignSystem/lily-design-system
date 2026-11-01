import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="taiwan-guomin-shenfenzheng-tongyi-bianhao-view"
  aria-label="National Identification Card Number">sample-value</span>`;

const meta = {
    title: "Headless/TaiwanGuominShenfenzhengTongyiBianhaoView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
