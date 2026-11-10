import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="editable">
  <button
    type="button"
    class="editable-button"
    aria-label="Draft title, Title"  >Draft title</button>
  <input
    type="text"
    class="editable-input"
    aria-label="Title"
    value="Draft title" hidden  >
</div>`;

const meta = {
    title: "Headless/Editable",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
