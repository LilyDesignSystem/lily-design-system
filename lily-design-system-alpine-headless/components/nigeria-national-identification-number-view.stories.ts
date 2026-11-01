import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="nigeria-national-identification-number-view"\n  aria-label="National Identification Number (NIN)"\n></span>';

const meta = {
    title: "Headless/Nigeria National Identification Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
