import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HorizontalScroller from './HorizontalScroller.vue';

const meta = {
  title: 'Headless/HorizontalScroller',
  component: HorizontalScroller,
  tags: ['autodocs']
} satisfies Meta<typeof HorizontalScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
