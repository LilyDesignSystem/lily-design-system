import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<fieldset class="red-amber-green-picker" role="radiogroup" aria-label="" x-data="{ value: \'\' }" :data-value="value">\n  <label class="red-amber-green-picker-button"><input type="radio" name="status" value="red" aria-label="red" x-model="value"> red</label>\n  <label class="red-amber-green-picker-button"><input type="radio" name="status" value="amber" aria-label="amber" x-model="value"> amber</label>\n  <label class="red-amber-green-picker-button"><input type="radio" name="status" value="green" aria-label="green" x-model="value"> green</label>\n</fieldset>';

const meta = {
    title: "Headless/Red Amber Green Picker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
