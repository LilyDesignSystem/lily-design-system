import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<table><tbody class="table-body">
  <!-- Consumer provides content -->
</tbody></table>`;

const meta = {
    title: "Headless/TableBody",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
