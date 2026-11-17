import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<time class="duration-view" datetime="P3DT4H"><span class="screen-reader-span">Length of stay </span>3 days 4 hours</time>`;

const meta = {
    title: "Headless/DurationView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
