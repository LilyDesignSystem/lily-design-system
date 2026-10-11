import type { Meta, StoryObj } from '@storybook/react-vite';
import SegmentGroupItem from './SegmentGroupItem';

const meta = {
  title: 'Headless/SegmentGroupItem',
  component: SegmentGroupItem,
  tags: ['autodocs']
} satisfies Meta<typeof SegmentGroupItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
