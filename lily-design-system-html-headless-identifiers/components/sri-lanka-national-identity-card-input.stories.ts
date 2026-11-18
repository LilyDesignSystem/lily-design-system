import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="sri-lanka-national-identity-card-input"
  type="text"
  aria-label="National Identity Card (NIC) number"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/SriLankaNationalIdentityCardInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
