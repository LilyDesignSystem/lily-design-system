import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SegmentGroupItem from './SegmentGroupItem.vue';

const meta = {
  title: 'Headless/SegmentGroupItem',
  component: SegmentGroupItem,
  tags: ['autodocs']
} satisfies Meta<typeof SegmentGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
