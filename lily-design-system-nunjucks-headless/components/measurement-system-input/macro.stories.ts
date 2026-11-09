import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="measurement-system-input"
  type="text"
  value="" id="system" aria-label="Measurement system">`;

const meta = {
    title: "Headless/MeasurementSystemInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
