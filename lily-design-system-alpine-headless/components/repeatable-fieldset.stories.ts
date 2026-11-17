import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<fieldset\n  class="repeatable-fieldset"\n  data-count="2"\n>\n  <legend>Medicines</legend>\n  <fieldset\n    class="repeatable-fieldset-item"\n    data-index="0"\n  >\n    <legend class="repeatable-fieldset-item-legend">Medicine 1</legend>\n    <label for="medicine-0">Name</label>\n    <input\n      id="medicine-0"\n      name="medicine-0"\n      value="Aspirin"\n    />\n    <button\n      type="submit"\n      class="repeatable-fieldset-remove"\n      name="medicines-remove"\n      value="0"\n      formnovalidate\n    >\n      Remove medicine 1\n    </button>\n  </fieldset>\n  <fieldset\n    class="repeatable-fieldset-item"\n    data-index="1"\n  >\n    <legend class="repeatable-fieldset-item-legend">Medicine 2</legend>\n    <label for="medicine-1">Name</label>\n    <input\n      id="medicine-1"\n      name="medicine-1"\n    />\n    <button\n      type="submit"\n      class="repeatable-fieldset-remove"\n      name="medicines-remove"\n      value="1"\n      formnovalidate\n    >\n      Remove medicine 2\n    </button>\n  </fieldset>\n  <button\n    type="submit"\n    class="repeatable-fieldset-add"\n    name="medicines-add"\n    value="1"\n    formnovalidate\n  >\n    Add another medicine\n  </button>\n</fieldset>';

const meta = {
    title: "Headless/Repeatable Fieldset",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
