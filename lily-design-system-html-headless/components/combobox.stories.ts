import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="combobox">
  <input
    type="text"
    role="combobox"
    aria-label="Fruit"
    aria-expanded="false"
    aria-controls="combobox-listbox"
    aria-autocomplete="list"
  />
  <div role="listbox" id="combobox-listbox" aria-label="Fruit" hidden>
    <div role="option">Apple</div>
    <div role="option">Banana</div>
  </div>
</div>`;

const meta = {
    title: "Headless/Combobox",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
