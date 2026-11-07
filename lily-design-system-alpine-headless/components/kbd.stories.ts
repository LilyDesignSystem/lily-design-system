import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<kbd\n  class="kbd"\n>\n  <span class="screen-reader-span">Example </span><span class="kbd-text" aria-hidden="true"><!-- Consumer provides content --></span>\n</kbd>';

const meta = {
    title: "Headless/Kbd",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
