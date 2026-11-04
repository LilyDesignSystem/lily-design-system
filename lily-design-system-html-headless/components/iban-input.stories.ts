import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="iban-input"
  type="text"
  aria-label="IBAN"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/IbanInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
