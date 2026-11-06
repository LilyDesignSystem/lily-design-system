import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span class="united-states-social-security-number-view">\n  <!-- Consumer provides text content -->\n</span>';

const meta = {
    title: "Headless/United States Social Security Number View",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
