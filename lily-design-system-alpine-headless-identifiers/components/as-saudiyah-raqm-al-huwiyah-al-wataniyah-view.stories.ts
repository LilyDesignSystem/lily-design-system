import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="as-saudiyah-raqm-al-huwiyah-al-wataniyah-view"\n  ><span class="screen-reader-span">National Identification Number </span></span\n>';

const meta = {
    title: "Headless/As Saudiyah Raqm Al Huwiyah Al Wataniyah View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
