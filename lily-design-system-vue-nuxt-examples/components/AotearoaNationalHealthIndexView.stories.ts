import type { Meta, StoryObj } from '@storybook/vue3-vite';
import AotearoaNationalHealthIndexView from './AotearoaNationalHealthIndexView.vue';

const meta = {
  title: 'Headless/AotearoaNationalHealthIndexView',
  component: AotearoaNationalHealthIndexView,
  tags: ['autodocs']
} satisfies Meta<typeof AotearoaNationalHealthIndexView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'AotearoaNationalHealthIndexView' }
};
