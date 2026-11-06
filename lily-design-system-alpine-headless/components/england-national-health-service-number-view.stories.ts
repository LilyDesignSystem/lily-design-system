import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="england-national-health-service-number-view"\n  ><span class="screen-reader-span">National Health Service Number </span></span\n>';

const meta = {
    title: "Headless/England National Health Service Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
