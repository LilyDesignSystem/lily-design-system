import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<figure
  class="video-player"
  aria-label="">
  <video
    class="video-player-element"
    src="" controls    playsinline
  ></video></figure>`;

const meta = {
  title: 'Headless/VideoPlayer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
