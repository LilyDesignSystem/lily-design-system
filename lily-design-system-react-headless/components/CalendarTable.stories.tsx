import type { Meta, StoryObj } from '@storybook/react-vite';
import CalendarTable from './CalendarTable';

const meta = {
  title: 'Headless/CalendarTable',
  component: CalendarTable,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
