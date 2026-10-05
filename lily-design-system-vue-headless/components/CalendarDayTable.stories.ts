import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarDayTable from './CalendarDayTable.vue';

const meta = {
  title: 'Headless/CalendarDayTable',
  component: CalendarDayTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarDayTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "Monday 6 January 2025" },
};
