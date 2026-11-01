import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="pakistan-computerized-national-identity-card-input"
  type="text"
  aria-label="Computerized National Identity Card Number (CNIC)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/PakistanComputerizedNationalIdentityCardInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
