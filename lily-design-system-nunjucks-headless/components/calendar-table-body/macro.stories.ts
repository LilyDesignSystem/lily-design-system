import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tbody
  class="calendar-table-body"></tbody>`;

const meta = {
  title: 'Headless/CalendarTableBody',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
