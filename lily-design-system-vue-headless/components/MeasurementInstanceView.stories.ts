import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MeasurementInstanceView from './MeasurementInstanceView.vue';

const meta = {
  title: 'Headless/MeasurementInstanceView',
  component: MeasurementInstanceView,
  tags: ['autodocs']
} satisfies Meta<typeof MeasurementInstanceView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
