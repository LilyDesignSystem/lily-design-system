import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NetPromoterScoreView component -->\n<!--\n  Description: a read-only display of a Net Promoter Score\n  HTML tag: <span>\n  CSS class: net-promoter-score-view\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"net-promoter-score-view\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"net-promoter-score-view\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Net Promoter Score View',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
