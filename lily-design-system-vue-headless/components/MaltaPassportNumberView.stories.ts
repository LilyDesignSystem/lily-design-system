import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MaltaPassportNumberView from './MaltaPassportNumberView.vue';

const meta = {
  title: 'Headless/MaltaPassportNumberView',
  component: MaltaPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof MaltaPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'MaltaPassportNumberView' }
};
