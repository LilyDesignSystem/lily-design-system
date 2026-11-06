import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<table><thead class="table-head">\n  <!-- Consumer provides content -->\n</thead></table>';

const meta = {
    title: "Headless/Table Head",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
