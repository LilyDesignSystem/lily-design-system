import type { Meta, StoryObj } from '@storybook/react-vite';
import MisrAlRaqmAlQawmiView from './MisrAlRaqmAlQawmiView';

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
