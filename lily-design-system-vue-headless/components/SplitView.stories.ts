import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SplitView from './SplitView.vue';

const meta = {
  title: 'Headless/SplitView',
  component: SplitView,
  tags: ['autodocs']
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
