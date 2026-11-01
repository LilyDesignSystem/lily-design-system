import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="tool-bar" aria-label="" x-data="lilyToolBar()" x-bind="bar">\n  <!-- Consumer provides tool-bar-button buttons -->\n</div>';

const meta = {
    title: "Headless/Tool Bar",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
