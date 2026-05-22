import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarTableHead from './CalendarTableHead.vue';

const meta = {
  title: 'Headless/CalendarTableHead',
  component: CalendarTableHead,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
