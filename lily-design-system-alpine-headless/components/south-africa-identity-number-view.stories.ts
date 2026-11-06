import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="south-africa-identity-number-view"\n  ><span class="screen-reader-span">South African Identity Number </span></span\n>';

const meta = {
    title: "Headless/South Africa Identity Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
