import type { Meta, StoryObj } from '@storybook/vue3-vite';
import VideoPlayer from './VideoPlayer.vue';

const meta = {
  title: 'Headless/VideoPlayer',
  component: VideoPlayer,
  tags: ['autodocs']
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
