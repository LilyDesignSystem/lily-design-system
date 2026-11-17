import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset class="repeatable-fieldset" data-count="1"><legend>Medicines</legend><fieldset class="repeatable-fieldset-item" data-index="0"><legend class="repeatable-fieldset-item-legend">Medicine 1</legend><label for="demo-medicine-0">Name</label> <input id="demo-medicine-0" name="medicine-0" value="Aspirin"> <button type="button" class="repeatable-fieldset-remove">Remove medicine 1</button></fieldset><button type="button" class="repeatable-fieldset-add">Add another medicine</button></fieldset>`;

const meta = {
    title: "Headless/RepeatableFieldset",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
