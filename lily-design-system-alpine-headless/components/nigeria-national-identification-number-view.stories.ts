import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="nigeria-national-identification-number-view"\n  ><span class="screen-reader-span">National Identification Number (NIN) </span></span\n>';

const meta = {
    title: "Headless/Nigeria National Identification Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
