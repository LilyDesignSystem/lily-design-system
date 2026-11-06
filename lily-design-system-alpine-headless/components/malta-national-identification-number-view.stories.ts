import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="malta-national-identification-number-view"\n  ><span class="screen-reader-span">Malta National Identification Number </span></span\n>';

const meta = {
    title: "Headless/Malta National Identification Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
