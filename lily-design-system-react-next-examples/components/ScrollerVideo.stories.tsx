import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollerVideo from './ScrollerVideo';

const meta = {
  title: 'Examples/ScrollerVideo',
  component: ScrollerVideo,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollerVideo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
