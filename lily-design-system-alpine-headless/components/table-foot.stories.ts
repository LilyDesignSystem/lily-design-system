import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<table><tfoot class="table-foot">\n  <!-- Consumer provides content -->\n</tfoot></table>';

const meta = {
    title: "Headless/Table Foot",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
