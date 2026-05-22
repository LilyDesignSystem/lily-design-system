import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DateTimeView from './DateTimeView.vue';

const meta = {
  title: 'Headless/DateTimeView',
  component: DateTimeView,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
