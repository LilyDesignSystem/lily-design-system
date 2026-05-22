import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CalendarTableRow from './CalendarTableRow.vue';

const meta = {
  title: 'Headless/CalendarTableRow',
  component: CalendarTableRow,
  tags: ['autodocs']
} satisfies Meta<typeof CalendarTableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
