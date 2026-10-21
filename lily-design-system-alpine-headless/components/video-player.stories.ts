import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- VideoPlayer component -->\n<!--\n  Description: a video player container\n  HTML tag: <div>\n  CSS class: video-player\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"video-player\"\n  aria-label=\"\"\n>\n  <video class=\"video-player-element\" src=\"\" controls playsinline></video>\n  <figcaption class=\"video-player-caption\">\n    <!-- Consumer provides caption -->\n  </figcaption>\n</div>";

const meta = {
  title: 'Headless/Video Player',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
