import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CeskoCestovniPasView from './CeskoCestovniPasView.vue';

const meta = {
  title: 'Headless/CeskoCestovniPasView',
  component: CeskoCestovniPasView,
  tags: ['autodocs']
} satisfies Meta<typeof CeskoCestovniPasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'CeskoCestovniPasView' }
};
