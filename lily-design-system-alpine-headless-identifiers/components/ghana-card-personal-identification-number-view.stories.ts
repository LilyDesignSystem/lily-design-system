import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="ghana-card-personal-identification-number-view"\n  ><span class="screen-reader-span">Ghana Card PIN </span></span\n>';

const meta = {
    title: "Headless/Ghana Card Personal Identification Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
