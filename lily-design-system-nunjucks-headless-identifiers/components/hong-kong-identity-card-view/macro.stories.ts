import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="hong-kong-identity-card-view"
  aria-label="Hong Kong Identity Card Number">sample-value</span>`;

const meta = {
    title: "Headless/HongKongIdentityCardView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
