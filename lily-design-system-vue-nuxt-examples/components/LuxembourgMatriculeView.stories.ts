import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LuxembourgMatriculeView from './LuxembourgMatriculeView.vue';

const meta = {
  title: 'Headless/LuxembourgMatriculeView',
  component: LuxembourgMatriculeView,
  tags: ['autodocs']
} satisfies Meta<typeof LuxembourgMatriculeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LuxembourgMatriculeView' }
};
