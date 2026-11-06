import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<table><tfoot class="table-foot">
  <!-- Consumer provides content -->
</tfoot></table>`;

const meta = {
    title: "Headless/TableFoot",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
