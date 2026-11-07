import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<fieldset class="red-orange-yellow-green-blue-picker" role="radiogroup" aria-label="" x-data="{ value: \'\' }" :data-value="value">\n  <label class="red-orange-yellow-green-blue-picker-button"><input type="radio" name="status" value="red" aria-label="red" x-model="value"> red</label>\n  <label class="red-orange-yellow-green-blue-picker-button"><input type="radio" name="status" value="orange" aria-label="orange" x-model="value"> orange</label>\n  <label class="red-orange-yellow-green-blue-picker-button"><input type="radio" name="status" value="yellow" aria-label="yellow" x-model="value"> yellow</label>\n  <label class="red-orange-yellow-green-blue-picker-button"><input type="radio" name="status" value="green" aria-label="green" x-model="value"> green</label>\n  <label class="red-orange-yellow-green-blue-picker-button"><input type="radio" name="status" value="blue" aria-label="blue" x-model="value"> blue</label>\n</fieldset>';

const meta = {
    title: "Headless/Red Orange Yellow Green Blue Picker",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
