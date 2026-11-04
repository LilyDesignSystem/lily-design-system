import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="iban-view"
  aria-label="IBAN">sample-value</span>`;

const meta = {
    title: "Headless/IbanView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
