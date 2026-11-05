import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<div
  class="tag-input-div"
  data-module="tag-input-div">
  <ul class="tag-input-div-list" role="list">  </ul>
  <input
    class="tag-input-div-field"
    type="text"  >
</div>`;

const meta = {
    title: "Headless/TagInputDiv",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
