import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DateTimeNowInput from './DateTimeNowInput.vue';

const meta = {
  title: 'Headless/DateTimeNowInput',
  component: DateTimeNowInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeNowInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
