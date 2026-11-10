import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<span
  class="character-counter"
  data-count="0" data-max="200" data-remaining="200"><span class="character-counter-text" aria-hidden="true">0 / 200</span><span class="character-counter-status screen-reader-span" role="status" aria-label="Characters used">0 / 200</span></span>`;

const meta = {
    title: "Headless/CharacterCounter",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
