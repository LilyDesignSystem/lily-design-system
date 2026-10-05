import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarYearTable from './CalendarYearTable';

const meta = {
  title: 'Headless/CalendarYearTable',
  component: CalendarYearTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarYearTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Example', children: <tbody><tr><td>1</td></tr></tbody> }
};
