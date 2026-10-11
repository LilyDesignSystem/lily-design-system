import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarWeekTable from './CalendarWeekTable.vue';

const meta = {
  title: 'Headless/CalendarWeekTable',
  component: CalendarWeekTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarWeekTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Week of 6 January 2025" },
};
