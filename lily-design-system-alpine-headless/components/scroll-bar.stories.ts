import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="scroll-bar" aria-label="" aria-orientation="vertical" x-data="lilyScrollBar(50, 0, 100, 1, 10)" x-bind="bar">\n  <!-- Consumer provides the thumb; it scrolls its content on lily:change -->\n</div>';

const meta = {
    title: "Headless/Scroll Bar",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
