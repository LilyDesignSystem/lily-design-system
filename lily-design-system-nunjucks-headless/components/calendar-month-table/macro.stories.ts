import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="calendar-month-table"
  role="grid"
  aria-label="Example"
  data-view="month"></table>`;

const meta = {
  title: 'Headless/CalendarMonthTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
