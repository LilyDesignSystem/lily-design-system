import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BharatAadhaarView from './BharatAadhaarView.vue';

const meta = {
  title: 'Headless/BharatAadhaarView',
  component: BharatAadhaarView,
  tags: ['autodocs']
} satisfies Meta<typeof BharatAadhaarView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BharatAadhaarView' }
};
