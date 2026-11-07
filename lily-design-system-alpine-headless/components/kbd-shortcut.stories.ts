import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<kbd class="kbd-shortcut"><span class="screen-reader-span">Control K </span><kbd class="kbd-shortcut-key" aria-hidden="true">Ctrl</kbd><span class="kbd-shortcut-separator" aria-hidden="true">+</span><kbd class="kbd-shortcut-key" aria-hidden="true">K</kbd></kbd>';

const meta = {
    title: "Headless/Kbd Shortcut",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
