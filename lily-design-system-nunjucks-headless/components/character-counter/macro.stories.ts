import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="character-counter"
  aria-live="polite">0 characters</span>`;

const meta = {
    title: "Headless/CharacterCounter",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
