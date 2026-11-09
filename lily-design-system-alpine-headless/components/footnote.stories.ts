import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<span\n  class="footnote"\n  id=""\n  role="note"\n>\n  <!-- Consumer provides footnote content -->\n</span>';

const meta = {
    title: "Headless/Footnote",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
