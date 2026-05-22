import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="calendar-range-picker"
  role="group"
  aria-label="Date range"
  data-module="calendar-range-picker">
  <label class="calendar-range-picker-start-label" for="calendar-range-picker-start">Start</label>
  <input class="calendar-range-picker-start" type="date" id="calendar-range-picker-start" value="">
  <label class="calendar-range-picker-end-label" for="calendar-range-picker-end">End</label>
  <input class="calendar-range-picker-end" type="date" id="calendar-range-picker-end" value="">
</div>`;

const meta = {
  title: 'Headless/CalendarRangePicker',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
