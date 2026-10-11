import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarDayTable from './CalendarDayTable';

const meta = {
  title: 'Headless/CalendarDayTable',
  component: CalendarDayTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarDayTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <tbody><tr><td>1</td></tr></tbody> }
};
