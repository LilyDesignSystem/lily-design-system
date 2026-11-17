import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<time\n  class="duration-view"\n  datetime="P3DT4H"\n  ><span class="screen-reader-span">Length of stay </span>3 days 4 hours</time\n>';

const meta = {
    title: "Headless/Duration View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
