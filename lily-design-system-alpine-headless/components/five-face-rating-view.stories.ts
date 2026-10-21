import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FiveFaceRatingView component -->\n<!--\n  Description: a read-only display of a five-face satisfaction rating\n  HTML tag: <span>\n  CSS class: five-face-rating-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"five-face-rating-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"five-face-rating-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Five Face Rating View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
