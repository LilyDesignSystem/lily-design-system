import type { Meta, StoryObj } from '@storybook/react-vite';
import DateRange from './DateRange';

const meta = {
  title: 'Headless/DateRange',
  component: DateRange,
  tags: ['autodocs']
} satisfies Meta<typeof DateRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
