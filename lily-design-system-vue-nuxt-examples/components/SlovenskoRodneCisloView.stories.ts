import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SlovenskoRodneCisloView from './SlovenskoRodneCisloView.vue';

const meta = {
  title: 'Headless/SlovenskoRodneCisloView',
  component: SlovenskoRodneCisloView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoRodneCisloView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoRodneCisloView' }
};
