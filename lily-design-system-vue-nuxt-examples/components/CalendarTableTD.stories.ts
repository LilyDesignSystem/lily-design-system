import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarTableTD from './CalendarTableTD.vue';

const meta = {
  title: 'Headless/CalendarTableTD',
  component: CalendarTableTD,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableTD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
