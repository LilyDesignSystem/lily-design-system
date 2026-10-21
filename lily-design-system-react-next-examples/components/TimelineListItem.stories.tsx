import type { Meta, StoryObj } from '@storybook/react-vite';
import TimelineListItem from './TimelineListItem';

const meta = {
  title: 'Headless/TimelineListItem',
  component: TimelineListItem,
  tags: ['autodocs']
} satisfies Meta<typeof TimelineListItem>;

export default meta;
type Story = StoryObj<typeof TimelineListItem>;

export const Default: Story = {};
