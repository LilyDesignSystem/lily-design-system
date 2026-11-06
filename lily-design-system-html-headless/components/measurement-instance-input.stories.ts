import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="measurement-instance-input"
  type="text"
  aria-label=""
/>`;

const meta = {
    title: "Headless/MeasurementInstanceInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
