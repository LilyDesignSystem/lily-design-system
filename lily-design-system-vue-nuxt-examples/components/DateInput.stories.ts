import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DateInput from './DateInput.vue';

const meta = {
  title: 'Headless/DateInput',
  component: DateInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
