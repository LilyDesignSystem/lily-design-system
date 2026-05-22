import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MeasurementSystemView from './MeasurementSystemView.vue';

const meta = {
  title: 'Headless/MeasurementSystemView',
  component: MeasurementSystemView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementSystemView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
