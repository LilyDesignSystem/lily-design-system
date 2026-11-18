import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="bangladesh-national-identity-card-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="National ID (NID) number">`;

const meta = {
    title: "Headless/BangladeshNationalIdentityCardInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
