import type { Meta, StoryObj } from '@storybook/vue3-vite';
import BelgiqueNumeroDeRegistreNationalView from './BelgiqueNumeroDeRegistreNationalView.vue';

const meta = {
  title: 'Headless/BelgiqueNumeroDeRegistreNationalView',
  component: BelgiqueNumeroDeRegistreNationalView,
  tags: ['autodocs']
} satisfies Meta<typeof BelgiqueNumeroDeRegistreNationalView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'BelgiqueNumeroDeRegistreNationalView' }
};
