import type { Meta, StoryObj } from '@storybook/vue3-vite';
import NorgeFodselsnummerView from './NorgeFodselsnummerView.vue';

const meta = {
  title: 'Headless/NorgeFodselsnummerView',
  component: NorgeFodselsnummerView,
  tags: ['autodocs']
} satisfies Meta<typeof NorgeFodselsnummerView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: 'NorgeFodselsnummerView' }
};
