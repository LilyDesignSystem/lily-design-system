import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="mauritius-national-identity-card-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National Identity Card number">`;

const meta = {
    title: "Headless/MauritiusNationalIdentityCardNumberInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
