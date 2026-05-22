import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="date-time-now-input">
  <input class="date-time-now-input-date" type="date" value="" id="-date" name="-date" aria-label="Date">
  <input class="date-time-now-input-time" type="time" value="" id="-time" name="-time" aria-label="Time">
  <button class="date-time-now-input-now" type="button" data-date-time-now>Now</button>
</div>`;

const meta = {
  title: 'Headless/DateTimeNowInput',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
