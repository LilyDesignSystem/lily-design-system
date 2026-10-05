import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="calendar-day-table"
  role="grid"
  aria-label="Example"
  data-view="day"></table>`;

const meta = {
  title: 'Headless/CalendarDayTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
