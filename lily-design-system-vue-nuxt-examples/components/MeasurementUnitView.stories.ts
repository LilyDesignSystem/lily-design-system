import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MeasurementUnitView from './MeasurementUnitView.vue';

const meta = {
  title: 'Headless/MeasurementUnitView',
  component: MeasurementUnitView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementUnitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
