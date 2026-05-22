import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DateRange from './DateRange.vue';

const meta = {
  title: 'Headless/DateRange',
  component: DateRange,
  tags: ['autodocs']
} satisfies Meta<typeof DateRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
