import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<input
  class="ghana-card-personal-identification-number-input"
  type="text"
  autocomplete="off"
  spellcheck="false"
  aria-label="Ghana Card PIN">`;

const meta = {
    title: "Headless/GhanaCardPersonalIdentificationNumberInput",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
