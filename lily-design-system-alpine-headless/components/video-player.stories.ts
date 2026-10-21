import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<div\n  class=\"video-player\"\n  aria-label=\"\"\n>\n  <video class=\"video-player-element\" src=\"\" controls playsinline></video>\n  <figcaption class=\"video-player-caption\">\n    <!-- Consumer provides caption -->\n  </figcaption>\n</div>";

const meta = {
  title: 'Headless/Video Player',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
