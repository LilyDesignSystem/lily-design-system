import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CalendarTableRow from './CalendarTableRow';

const meta = {
  title: 'Examples/CalendarTableRow',
  component: CalendarTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
