import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<dl><div class="summary-list-item">\n    <dt>Term</dt>\n    <dd><!-- Consumer provides the value --></dd>\n</div></dl>';

const meta = {
    title: "Headless/Summary List Item",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
