import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="hong-kong-identity-card-input"
  type="text"
  aria-label="Hong Kong Identity Card Number"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/HongKongIdentityCardInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
