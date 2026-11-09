import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<aside\n  class="warning-callout"\n  role="alert"\n  aria-label=""\n>\n  <!-- Consumer provides content -->\n</aside>';

const meta = {
    title: "Headless/Warning Callout",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
