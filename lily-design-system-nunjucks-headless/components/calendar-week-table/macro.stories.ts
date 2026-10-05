import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<table
  class="calendar-week-table"
  role="grid"
  aria-label="Example"
  data-view="week"></table>`;

const meta = {
  title: 'Headless/CalendarWeekTable',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
