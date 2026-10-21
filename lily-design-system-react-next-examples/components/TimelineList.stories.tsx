import type { Meta, StoryObj } from '@storybook/react-vite';
import TimelineList from './TimelineList';

const meta = {
  title: 'Headless/TimelineList',
  component: TimelineList,
  tags: ['autodocs']
} satisfies Meta<typeof TimelineList>;

export default meta;
type Story = StoryObj<typeof TimelineList>;

export const Default: Story = {};
