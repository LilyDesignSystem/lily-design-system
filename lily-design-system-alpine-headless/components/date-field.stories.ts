import type { Meta, StoryObj } from "@storybook/html-vite";

const html =
    '<fieldset\n  class="date-field"\n>\n  <legend><!-- Consumer provides the date\'s name --></legend>\n  <label for="date-field-year"><!-- Consumer provides the year label --></label>\n  <input\n    class="date-field-year"\n    id="date-field-year"\n    type="text"\n    inputmode="numeric"\n    maxlength="4"\n  />\n  <label for="date-field-month"><!-- Consumer provides the month label --></label>\n  <input\n    class="date-field-month"\n    id="date-field-month"\n    type="text"\n    inputmode="numeric"\n    maxlength="2"\n  />\n  <label for="date-field-day"><!-- Consumer provides the day label --></label>\n  <input\n    class="date-field-day"\n    id="date-field-day"\n    type="text"\n    inputmode="numeric"\n    maxlength="2"\n  />\n</fieldset>';

const meta = {
    title: "Headless/Date Field",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
