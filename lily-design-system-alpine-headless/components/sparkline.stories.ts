import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Sparkline component -->\n<!--\n  Description: a small inline chart showing a data trend\n  HTML tag: <div>\n  CSS class: sparkline\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"sparkline\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"sparkline\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Sparkline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
