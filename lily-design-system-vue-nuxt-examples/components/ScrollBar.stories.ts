import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScrollBar from './ScrollBar.vue';

const meta = {
  title: 'Headless/ScrollBar',
  component: ScrollBar,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
