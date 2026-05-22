import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TimeInput from './TimeInput.vue';

const meta = {
  title: 'Headless/TimeInput',
  component: TimeInput,
  tags: ['autodocs']
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
