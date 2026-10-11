import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarWeekTable from './CalendarWeekTable';

const meta = {
  title: 'Headless/CalendarWeekTable',
  component: CalendarWeekTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarWeekTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <tbody><tr><td>1</td></tr></tbody> }
};
