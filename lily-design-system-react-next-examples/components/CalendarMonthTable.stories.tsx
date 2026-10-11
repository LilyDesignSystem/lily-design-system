import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarMonthTable from './CalendarMonthTable';

const meta = {
  title: 'Headless/CalendarMonthTable',
  component: CalendarMonthTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarMonthTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <tbody><tr><td>1</td></tr></tbody> }
};
