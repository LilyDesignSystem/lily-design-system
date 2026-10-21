import type { Meta, StoryObj } from '@storybook/react-vite';
import ScrollerVideo from './ScrollerVideo';

const meta = {
  title: 'Headless/ScrollerVideo',
  component: ScrollerVideo,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollerVideo>;

export default meta;
type Story = StoryObj<typeof ScrollerVideo>;

export const Default: Story = {};
