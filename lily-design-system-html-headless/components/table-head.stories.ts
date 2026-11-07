import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<table><thead class="table-head">
  <!-- Consumer provides content -->
</thead></table>`;

const meta = {
    title: "Headless/TableHead",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
