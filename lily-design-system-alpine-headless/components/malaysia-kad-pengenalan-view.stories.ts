import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="malaysia-kad-pengenalan-view"\n  ><span class="screen-reader-span">MyKad Number (NRIC) </span></span\n>';

const meta = {
    title: "Headless/Malaysia Kad Pengenalan View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
