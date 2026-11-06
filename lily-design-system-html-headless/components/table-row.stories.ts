import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<table><tbody><tr class="table-row">
  <!-- Consumer provides content -->
</tr></tbody></table>`;

const meta = {
    title: "Headless/TableRow",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
