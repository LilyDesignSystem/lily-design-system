import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MisrAlRaqmAlQawmiView from './MisrAlRaqmAlQawmiView.vue';

const meta = {
  title: 'Headless/MisrAlRaqmAlQawmiView',
  component: MisrAlRaqmAlQawmiView,
  tags: ['autodocs']
} satisfies Meta<typeof MisrAlRaqmAlQawmiView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MisrAlRaqmAlQawmiView' }
};
