import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<dl\n  class="summary-list"\n  aria-label=""\n>\n  <!-- Consumer provides summary-list-item rows -->\n</dl>';

const meta = {
    title: "Headless/Summary List",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
