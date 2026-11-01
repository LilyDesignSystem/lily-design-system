import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="nigeria-national-identification-number-view"
  aria-label="National Identification Number (NIN)"
>sample-value</span>`;

const meta = {
    title: "Headless/NigeriaNationalIdentificationNumberView",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
