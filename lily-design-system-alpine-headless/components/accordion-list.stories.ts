import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ol\n  class="accordion-list"\n  aria-label=""\n>\n  <!-- Consumer provides accordion list items -->\n</ol>';

const meta = {
    title: "Headless/Accordion List",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
