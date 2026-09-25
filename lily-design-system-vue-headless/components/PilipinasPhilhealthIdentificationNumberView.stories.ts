import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PilipinasPhilhealthIdentificationNumberView from './PilipinasPhilhealthIdentificationNumberView.vue';

const meta = {
  title: 'Headless/PilipinasPhilhealthIdentificationNumberView',
  component: PilipinasPhilhealthIdentificationNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof PilipinasPhilhealthIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'PilipinasPhilhealthIdentificationNumberView' }
};
