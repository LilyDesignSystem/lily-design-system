import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- MockupTabletPortrait component -->\n<!--\n  Description: a box area that looks like a tablet computer in portrait mode\n  HTML tag: <div>\n  CSS class: mockup-tablet-portrait\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"mockup-tablet-portrait\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Mockup Tablet Portrait',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
