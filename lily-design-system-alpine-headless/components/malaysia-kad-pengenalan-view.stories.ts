import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="malaysia-kad-pengenalan-view"\n  aria-label="MyKad Number (NRIC)"\n></span>';

const meta = {
    title: "Headless/Malaysia Kad Pengenalan View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
