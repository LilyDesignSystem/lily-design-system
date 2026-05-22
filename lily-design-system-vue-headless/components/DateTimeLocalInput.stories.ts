import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DateTimeLocalInput from './DateTimeLocalInput.vue';

const meta = {
  title: 'Headless/DateTimeLocalInput',
  component: DateTimeLocalInput,
  tags: ['autodocs']
} satisfies Meta<typeof DateTimeLocalInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
