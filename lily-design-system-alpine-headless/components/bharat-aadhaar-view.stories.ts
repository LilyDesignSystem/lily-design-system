import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="bharat-aadhaar-view"><span class="screen-reader-span">Aadhaar (आधार) </span></span>';

const meta = {
    title: "Headless/Bharat Aadhaar View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
