import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<table><tbody><tr><td class="table-td">
  <!-- Consumer provides content -->
</td></tr></tbody></table>`;

const meta = {
    title: "Headless/TableTd",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
