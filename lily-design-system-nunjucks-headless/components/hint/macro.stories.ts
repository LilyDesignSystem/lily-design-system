import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<p
  class="hint"></p>`;

const meta = {
    title: "Headless/Hint",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
