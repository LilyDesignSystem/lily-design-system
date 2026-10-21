import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarRangePicker from './CalendarRangePicker';

const meta = {
  title: 'Headless/CalendarRangePicker',
  component: CalendarRangePicker,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarRangePicker>;

export default meta;
type Story = StoryObj<typeof CalendarRangePicker>;

export const Default: Story = {};
