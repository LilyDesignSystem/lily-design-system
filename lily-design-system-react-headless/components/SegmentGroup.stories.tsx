import type { Meta, StoryObj } from '@storybook/react-vite';
import SegmentGroup from './SegmentGroup';

const meta = {
  title: 'Headless/SegmentGroup',
  component: SegmentGroup,
  tags: ['autodocs']
} satisfies Meta<typeof SegmentGroup>;

export default meta;
type Story = StoryObj<typeof SegmentGroup>;

export const Default: Story = {};
