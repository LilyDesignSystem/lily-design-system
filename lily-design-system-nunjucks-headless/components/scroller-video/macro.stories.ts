import type { Meta, StoryObj } from '@storybook/html-vite';

const html = `<div
  class="scroller-video"
  data-offset="0.5"
  aria-label="">
  <div
    class="scroller-video-background"
    role="img"
    aria-roledescription="scrollable video"
    aria-label=""
  >
    <video class="scroller-video-element" src="" muted playsinline preload="auto"></video>
  </div>
  <div class="scroller-video-foreground scroller-base" data-offset="0.5"></div>
</div>`;

const meta = {
  title: 'Headless/ScrollerVideo',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
