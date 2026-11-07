import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<time class="review-date" datetime="2026-10-06"><span class="screen-reader-span">Last reviewed </span>6 October 2026</time>';

const meta = {
    title: "Headless/Review Date",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
