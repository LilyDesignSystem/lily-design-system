import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<tfoot
  class="calendar-table-foot"></tfoot>`;

const meta = {
  title: 'Headless/CalendarTableFoot',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
