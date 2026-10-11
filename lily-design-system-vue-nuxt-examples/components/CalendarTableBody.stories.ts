import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarTableBody from './CalendarTableBody.vue';

const meta = {
  title: 'Headless/CalendarTableBody',
  component: CalendarTableBody,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
