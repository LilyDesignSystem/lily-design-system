import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MeasurementInstanceInput from './MeasurementInstanceInput.vue';

const meta = {
  title: 'Headless/MeasurementInstanceInput',
  component: MeasurementInstanceInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementInstanceInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
