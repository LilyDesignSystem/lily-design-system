import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CalendarTableTH from './CalendarTableTH';

const meta = {
  title: 'Examples/CalendarTableTH',
  component: CalendarTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
