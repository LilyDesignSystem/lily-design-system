import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="footnote" id="fn-1"
  role="note">Source: WHO 2024 report.</span>`;

const meta = {
    title: "Headless/Footnote",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
