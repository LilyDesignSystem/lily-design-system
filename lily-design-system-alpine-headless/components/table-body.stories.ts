import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<table><tbody class="table-body">\n  <!-- Consumer provides content -->\n</tbody></table>';

const meta = {
    title: "Headless/Table Body",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
