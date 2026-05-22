import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CalendarTableHead from './CalendarTableHead';

const meta = {
  title: 'Examples/CalendarTableHead',
  component: CalendarTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
