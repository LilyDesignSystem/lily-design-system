import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<table\n  class="gantt-table"\n  role="grid"\n  aria-label=""\n  x-lily-grid\n>\n  <!-- Consumer provides thead, tbody, tfoot -->\n</table>';

const meta = {
    title: "Headless/Gantt Table",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
