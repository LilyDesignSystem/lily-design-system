import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- AspectRatioContainer component -->\n<!--\n  Description: a container that maintains a fixed aspect ratio\n  HTML tag: <div>\n  CSS class: aspect-ratio-container\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"aspect-ratio-container\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"aspect-ratio-container\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Aspect Ratio Container',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
