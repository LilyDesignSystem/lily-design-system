import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupTabletLandscape component -->\n<!--\n  Description: a box area that looks like a tablet computer in landscape mode\n  HTML tag: <div>\n  CSS class: mockup-tablet-landscape\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-tablet-landscape\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Tablet Landscape',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
