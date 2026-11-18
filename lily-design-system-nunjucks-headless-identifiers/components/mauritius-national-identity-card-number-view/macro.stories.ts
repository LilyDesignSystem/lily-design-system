import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="mauritius-national-identity-card-number-view"
  aria-label="National Identity Card number">sample-value</span>`;

const meta = {
    title: "Headless/MauritiusNationalIdentityCardNumberView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
