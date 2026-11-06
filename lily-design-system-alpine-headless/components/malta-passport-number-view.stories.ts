import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="malta-passport-number-view"\n  ><span class="screen-reader-span">Malta Passport Number </span></span\n>';

const meta = {
    title: "Headless/Malta Passport Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
