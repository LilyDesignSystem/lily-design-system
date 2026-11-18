import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="mauritius-national-identity-card-number-input"
  type="text"
  aria-label="National Identity Card number"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/MauritiusNationalIdentityCardNumberInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
