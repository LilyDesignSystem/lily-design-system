import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="calendar-year-table"
  role="grid"
  aria-label="Example"
  data-view="year"></table>`;

const meta = {
  title: 'Headless/CalendarYearTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
