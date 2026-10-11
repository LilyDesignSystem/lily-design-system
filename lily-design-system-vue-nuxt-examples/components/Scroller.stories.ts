import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Scroller from './Scroller.vue';

const meta = {
  title: 'Headless/Scroller',
  component: Scroller,
  tags: ['autodocs']
} satisfies Meta<typeof Scroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
