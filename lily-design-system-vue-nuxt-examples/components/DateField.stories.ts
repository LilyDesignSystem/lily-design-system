import type { Meta, StoryObj } from '@storybook/vue3-vite';
import DateField from './DateField.vue';

const meta = {
  title: 'Headless/DateField',
  component: DateField,
  tags: ['autodocs']
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
