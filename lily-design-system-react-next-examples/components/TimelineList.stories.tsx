import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import TimelineList from './TimelineList';

const meta = {
  title: 'Examples/TimelineList',
  component: TimelineList,
  tags: ['autodocs']
} satisfies Meta<typeof TimelineList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
