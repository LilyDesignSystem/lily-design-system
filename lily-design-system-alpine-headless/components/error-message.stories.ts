import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<p\n  class="error-message"\n  role="alert"\n  aria-label=""\n>\n  <!-- Consumer provides text content -->\n</p>';

const meta = {
    title: "Headless/Error Message",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
