import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DateRange from './DateRange';

const meta = {
  title: 'Examples/DateRange',
  component: DateRange,
  tags: ['autodocs']
} satisfies Meta<typeof DateRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
