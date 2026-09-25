import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NihonKojinBangoView from './NihonKojinBangoView.vue';

const meta = {
  title: 'Headless/NihonKojinBangoView',
  component: NihonKojinBangoView,
  tags: ['autodocs']
} satisfies Meta<typeof NihonKojinBangoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NihonKojinBangoView' }
};
