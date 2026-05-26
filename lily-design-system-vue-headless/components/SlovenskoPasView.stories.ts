import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SlovenskoPasView from './SlovenskoPasView.vue';

const meta = {
  title: 'Headless/SlovenskoPasView',
  component: SlovenskoPasView,
  tags: ['autodocs']
} satisfies Meta<typeof SlovenskoPasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'SlovenskoPasView' }
};
