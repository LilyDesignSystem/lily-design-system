import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MeasurementUnitInput from './MeasurementUnitInput.vue';

const meta = {
  title: 'Headless/MeasurementUnitInput',
  component: MeasurementUnitInput,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementUnitInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
