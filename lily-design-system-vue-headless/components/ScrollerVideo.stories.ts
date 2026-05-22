import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScrollerVideo from './ScrollerVideo.vue';

const meta = {
  title: 'Headless/ScrollerVideo',
  component: ScrollerVideo,
  tags: ['autodocs']
} satisfies Meta<typeof ScrollerVideo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
