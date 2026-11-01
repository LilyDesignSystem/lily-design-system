import type { Meta, StoryObj } from "@storybook/html-vite";

const html = '<input\n  class="hidden-input"\n  type="hidden"\n  name=""\n  value=""\n/>';

const meta = {
    title: "Headless/Hidden Input",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
