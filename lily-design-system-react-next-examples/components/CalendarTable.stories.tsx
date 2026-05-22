import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CalendarTable from './CalendarTable';

const meta = {
  title: 'Examples/CalendarTable',
  component: CalendarTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
