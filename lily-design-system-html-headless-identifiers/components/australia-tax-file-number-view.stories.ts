import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="australia-tax-file-number-view"
  aria-label="Tax File Number (TFN)"
>sample-value</span>`;

const meta = {
    title: "Headless/AustraliaTaxFileNumberView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
