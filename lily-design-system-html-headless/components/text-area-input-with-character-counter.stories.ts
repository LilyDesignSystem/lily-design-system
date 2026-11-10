import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="text-area-input-with-character-counter" data-counter-template="{count} / {max}">
  <textarea aria-label="Feedback" aria-describedby="text-area-input-with-character-counter-1" maxlength="500"></textarea>
  <span id="text-area-input-with-character-counter-1"><span aria-hidden="true">0 / 500</span><span class="screen-reader-span" role="status">0 / 500</span></span>
</div>`;

const meta = {
    title: "Headless/TextAreaInputWithCharacterCounter",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
