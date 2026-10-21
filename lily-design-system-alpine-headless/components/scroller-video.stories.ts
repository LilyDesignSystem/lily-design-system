import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ScrollerVideo component -->\n<!--\n  Description: a video-driven scrollytelling component\n  HTML tag: <div>\n  CSS class: scroller-video\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"scroller-video\"\n  aria-label=\"\"\n  data-offset=\"0.5\"\n>\n  <div class=\"scroller-video-background\" role=\"img\" aria-roledescription=\"scrollable video\" aria-label=\"\">\n    <video class=\"scroller-video-element\" src=\"\" muted playsinline preload=\"auto\"></video>\n  </div>\n  <div class=\"scroller-video-foreground scroller-base\" data-offset=\"0.5\">\n    <!-- Consumer provides step children -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Scroller Video',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
