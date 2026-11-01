import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="convert-into-value-div"\n>\n  <!-- Consumer provides content -->\n</div>';

const meta = {
    title: "Headless/Convert Into Value Div",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
