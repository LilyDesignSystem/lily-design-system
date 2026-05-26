import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LiechtensteinPassportNumberView from './LiechtensteinPassportNumberView.vue';

const meta = {
  title: 'Headless/LiechtensteinPassportNumberView',
  component: LiechtensteinPassportNumberView,
  tags: ['autodocs']
} satisfies Meta<typeof LiechtensteinPassportNumberView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LiechtensteinPassportNumberView' }
};
