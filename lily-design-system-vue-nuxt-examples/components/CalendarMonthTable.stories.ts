import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarMonthTable from './CalendarMonthTable.vue';

const meta = {
  title: 'Headless/CalendarMonthTable',
  component: CalendarMonthTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarMonthTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "January 2025" },
};
