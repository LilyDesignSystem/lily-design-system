import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="united-kingdom-national-insurance-number-view"\n  ><span class="screen-reader-span">National Insurance Number </span></span\n>';

const meta = {
    title: "Headless/United Kingdom National Insurance Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
