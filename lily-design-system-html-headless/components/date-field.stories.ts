import type { Meta, StoryObj } from "@storybook/html-vite";

const html = `<fieldset class="date-field">
  <legend>Date of birth</legend>
  <label for="dob-day">Day</label>
  <input class="date-field-day" id="dob-day" type="text" inputmode="numeric" maxlength="2" />
  <label for="dob-month">Month</label>
  <input class="date-field-month" id="dob-month" type="text" inputmode="numeric" maxlength="2" />
  <label for="dob-year">Year</label>
  <input class="date-field-year" id="dob-year" type="text" inputmode="numeric" maxlength="4" />
</fieldset>`;

const meta = {
    title: "Headless/DateField",
    render: () => html,
    tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
