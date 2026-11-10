import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="text-area-input-with-character-counter"
  data-module="text-area-input-with-character-counter">
  <textarea
    class="text-area-input-with-character-counter-textarea"
    id="example-textarea"
    rows="5" maxlength="200" aria-describedby="example-counter" aria-label="Message"  ></textarea>  <span
    class="text-area-input-with-character-counter-counter"
    id="example-counter"
    data-maximum="200"
    data-counter-template="{count} / {max}"  ><span aria-hidden="true">0 / 200</span><span class="screen-reader-span" role="status">0 / 200</span></span></div>`;

const meta = {
    title: "Headless/TextAreaInputWithCharacterCounter",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
