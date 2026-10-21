import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BeachBall component -->\n<!--\n  Description: a decorative animated beach ball element\n  HTML tag: <div>\n  CSS class: beach-ball\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"beach-ball\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"beach-ball\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Beach Ball',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
