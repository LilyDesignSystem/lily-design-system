import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="sri-lanka-national-identity-card-view"
  aria-label="National Identity Card (NIC) number">sample-value</span>`;

const meta = {
    title: "Headless/SriLankaNationalIdentityCardView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
