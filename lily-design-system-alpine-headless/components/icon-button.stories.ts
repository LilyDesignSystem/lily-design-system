import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<button\n  class="icon-button"\n  type="button"\n  aria-label=""\n>\n  <!-- Consumer provides icon content (SVG, emoji, or glyph) -->\n</button>';

const meta = {
    title: "Headless/Icon Button",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
