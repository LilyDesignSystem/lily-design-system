import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MaltaNationalIdentificationNumberView from './MaltaNationalIdentificationNumberView.vue';

const meta = {
  title: 'Headless/MaltaNationalIdentificationNumberView',
  component: MaltaNationalIdentificationNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaNationalIdentificationNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaNationalIdentificationNumberView' }
};
