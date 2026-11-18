import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="canada-social-insurance-number-view"\n  ><span class="screen-reader-span">Social Insurance Number (SIN) </span></span\n>';

const meta = {
    title: "Headless/Canada Social Insurance Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
