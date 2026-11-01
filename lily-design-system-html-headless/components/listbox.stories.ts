import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div class="listbox" role="listbox" aria-label="Fruits">
  <div role="option" tabindex="0" aria-selected="true">Apple</div>
  <div role="option" tabindex="-1" aria-selected="false">Banana</div>
  <div role="option" tabindex="-1" aria-selected="false">Cherry</div>
</div>`;

const meta = {
    title: "Headless/Listbox",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
