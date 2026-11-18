import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="bangladesh-national-identity-card-view"
  aria-label="National ID (NID) number">sample-value</span>`;

const meta = {
    title: "Headless/BangladeshNationalIdentityCardView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
