import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="progress-circle"\n  role="progressbar"\n  aria-label=""\n  aria-valuemin="0"\n  aria-valuemax="100"\n  aria-valuenow="0"\n>\n  <!-- Consumer provides content -->\n</div>';

const meta = {
    title: "Headless/Progress Circle",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
