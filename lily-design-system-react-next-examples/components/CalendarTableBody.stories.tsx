import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CalendarTableBody from './CalendarTableBody';

const meta = {
  title: 'Examples/CalendarTableBody',
  component: CalendarTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
