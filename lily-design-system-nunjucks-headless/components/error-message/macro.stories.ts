import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<p
  class="error-message">
  <span class="screen-reader-span">Error:</span></p>`;

const meta = {
    title: "Headless/ErrorMessage",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
