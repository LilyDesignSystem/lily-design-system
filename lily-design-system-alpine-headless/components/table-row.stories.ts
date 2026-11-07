import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<table><tbody><tr class="table-row">\n  <!-- Consumer provides content -->\n</tr></tbody></table>';

const meta = {
    title: "Headless/Table Row",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
