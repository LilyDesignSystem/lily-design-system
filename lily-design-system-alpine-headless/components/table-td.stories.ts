import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<table><tbody><tr><td class="table-td">\n  <!-- Consumer provides content -->\n</td></tr></tbody></table>';

const meta = {
    title: "Headless/Table TD",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
