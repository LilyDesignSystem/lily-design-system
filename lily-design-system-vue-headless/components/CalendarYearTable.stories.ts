import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarYearTable from './CalendarYearTable.vue';

const meta = {
  title: 'Headless/CalendarYearTable',
  component: CalendarYearTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarYearTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "2025" },
};
