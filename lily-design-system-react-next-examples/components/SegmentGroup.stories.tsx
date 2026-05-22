import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import SegmentGroup from './SegmentGroup';

const meta = {
  title: 'Examples/SegmentGroup',
  component: SegmentGroup,
  tags: ['autodocs']
} satisfies Meta<typeof SegmentGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
