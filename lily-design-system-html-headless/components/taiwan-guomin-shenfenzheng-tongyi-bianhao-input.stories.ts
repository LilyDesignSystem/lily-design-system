import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="taiwan-guomin-shenfenzheng-tongyi-bianhao-input"
  type="text"
  aria-label="National Identification Card Number"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/TaiwanGuominShenfenzhengTongyiBianhaoInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
