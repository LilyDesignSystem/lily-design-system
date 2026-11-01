import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="pakistan-computerized-national-identity-card-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Computerized National Identity Card Number (CNIC)">`;

const meta = {
    title: "Headless/PakistanComputerizedNationalIdentityCardInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
