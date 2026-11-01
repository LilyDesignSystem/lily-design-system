import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<ol class="tour-list" aria-label="" x-data="lilyTourList(true)" x-bind="list">\n  <!-- Consumer provides tour-list-item steps; it hears lily:close -->\n</ol>';

const meta = {
    title: "Headless/Tour List",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
