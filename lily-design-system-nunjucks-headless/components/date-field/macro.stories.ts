import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<fieldset
  class="date-field">  <div class="date-field-parts">
    <div class="date-field-part">
      <label class="date-field-part-label" for="-day">Day</label>
      <input class="date-field-part-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" id="-day" name="-day" value="">
    </div>
    <div class="date-field-part">
      <label class="date-field-part-label" for="-month">Month</label>
      <input class="date-field-part-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" id="-month" name="-month" value="">
    </div>
    <div class="date-field-part">
      <label class="date-field-part-label" for="-year">Year</label>
      <input class="date-field-part-input date-field-part-input-year" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" id="-year" name="-year" value="">
    </div>
  </div>
</fieldset>`;

const meta = {
  title: 'Headless/DateField',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
