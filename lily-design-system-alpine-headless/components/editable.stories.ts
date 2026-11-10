import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<div class="editable" x-data="lilyEditable(\'\', false, \'\')">\n  <button class="editable-button" x-bind="display"></button>\n  <input class="editable-input" x-bind="input" hidden>\n</div>';

const meta = {
    title: "Headless/Editable",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
