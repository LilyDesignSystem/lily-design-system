import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarTableFoot from './CalendarTableFoot.vue';

const meta = {
  title: 'Headless/CalendarTableFoot',
  component: CalendarTableFoot,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableFoot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
