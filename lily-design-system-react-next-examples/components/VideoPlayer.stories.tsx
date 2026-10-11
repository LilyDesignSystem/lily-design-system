import type { Meta, StoryObj } from '@storybook/react-vite';
import VideoPlayer from './VideoPlayer';

const meta = {
  title: 'Headless/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs']
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
