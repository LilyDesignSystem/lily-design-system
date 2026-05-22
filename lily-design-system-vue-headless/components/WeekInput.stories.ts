import type { Meta, StoryObj } from '@storybook/vue3-vite';
import WeekInput from './WeekInput.vue';

const meta = {
  title: 'Headless/WeekInput',
  component: WeekInput,
  tags: ['autodocs']
} satisfies Meta<typeof WeekInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
