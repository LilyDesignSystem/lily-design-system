import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarTableTH from './CalendarTableTH.vue';

const meta = {
  title: 'Examples/CalendarTableTH',
  component: CalendarTableTH,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableTH>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
