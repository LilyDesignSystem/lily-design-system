import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<thead
  class="calendar-table-head"
>
  <!-- Consumer provides child elements -->
</thead>`;

const meta = {
  title: 'Headless/CalendarTableHead',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
