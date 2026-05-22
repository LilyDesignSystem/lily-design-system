import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="video-player"
  aria-label=""
>
  <video class="video-player-element" src="" controls playsinline></video>
  <figcaption class="video-player-caption">
    <!-- Consumer provides caption -->
  </figcaption>
</div>`;

const meta = {
  title: 'Headless/VideoPlayer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
