import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarRangePicker from './CalendarRangePicker.vue';

const meta = {
  title: 'Headless/CalendarRangePicker',
  component: CalendarRangePicker,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
