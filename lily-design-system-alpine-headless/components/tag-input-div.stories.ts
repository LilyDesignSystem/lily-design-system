import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="tag-input-div" role="group" aria-label="" x-data="lilyTagInputDiv()">\n  <ul class="tag-input-div-list">\n    <template x-for="tag in tags" :key="tag">\n      <li class="tag-input-div-list-item">\n        <span x-text="tag"></span>\n        <button type="button" class="tag-input-div-list-item-remove" aria-label="" @click="remove(tag)"><!-- Consumer provides remove label --></button>\n      </li>\n    </template>\n  </ul>\n  <input class="tag-input-div-field" aria-label="" x-bind="input">\n</div>';

const meta = {
    title: "Headless/Tag Input Div",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
