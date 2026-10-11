import type { Meta, StoryObj } from '@storybook/vue3-vite';
import SegmentGroup from './SegmentGroup.vue';

const meta = {
  title: 'Headless/SegmentGroup',
  component: SegmentGroup,
  tags: ['autodocs']
} satisfies Meta<typeof SegmentGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
