import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<aside
  class="warning-callout"
  role="note"></aside>`;

const meta = {
    title: "Headless/WarningCallout",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
