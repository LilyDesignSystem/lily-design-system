import type { Meta, StoryObj } from '@storybook/vue3-vite';
import TimelineListItem from './TimelineListItem.vue';

const meta = {
  title: 'Examples/TimelineListItem',
  component: TimelineListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TimelineListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
