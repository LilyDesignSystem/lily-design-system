import type { Meta, StoryObj } from '@storybook/vue3-vite';
import LietuvaPasasView from './LietuvaPasasView.vue';

const meta = {
  title: 'Headless/LietuvaPasasView',
  component: LietuvaPasasView,
  tags: ['autodocs']
} satisfies Meta<typeof LietuvaPasasView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'LietuvaPasasView' }
};
