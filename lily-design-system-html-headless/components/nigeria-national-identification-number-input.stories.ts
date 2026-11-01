import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="nigeria-national-identification-number-input"
  type="text"
  aria-label="National Identification Number (NIN)"
  autocomplete="off"
>`;

const meta = {
    title: "Headless/NigeriaNationalIdentificationNumberInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
