import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div\n  class="convert-div"\n  role="group"\n  aria-label="Currency converter"\n>\n  <!-- Consumer provides content -->\n</div>';

const meta = {
    title: "Headless/Convert Div",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
