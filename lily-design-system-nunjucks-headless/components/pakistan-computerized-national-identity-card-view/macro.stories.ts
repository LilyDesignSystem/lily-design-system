import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="pakistan-computerized-national-identity-card-view"
  aria-label="Computerized National Identity Card Number (CNIC)">sample-value</span>`;

const meta = {
    title: "Headless/PakistanComputerizedNationalIdentityCardView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
