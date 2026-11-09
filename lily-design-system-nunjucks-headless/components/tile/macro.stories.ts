import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="tile" role="group" aria-label="Analytics"><h3 class="tile-heading">Analytics</h3><p class="tile-text">View your metrics.</p></div>`;

const meta = {
    title: "Headless/Tile",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
