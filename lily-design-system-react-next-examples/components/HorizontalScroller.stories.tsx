import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HorizontalScroller from './HorizontalScroller';

const meta = {
  title: 'Examples/HorizontalScroller',
  component: HorizontalScroller,
  tags: ['autodocs']
} satisfies Meta<typeof HorizontalScroller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
