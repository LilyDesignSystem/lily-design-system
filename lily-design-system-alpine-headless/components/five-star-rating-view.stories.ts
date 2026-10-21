import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- FiveStarRatingView component -->\n<!--\n  Description: a read-only display of a five-star rating\n  HTML tag: <span>\n  CSS class: five-star-rating-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"five-star-rating-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"five-star-rating-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Five Star Rating View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
