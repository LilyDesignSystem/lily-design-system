import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="australia-tax-file-number-input"
  type="text"
  aria-label="Tax File Number (TFN)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/AustraliaTaxFileNumberInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
