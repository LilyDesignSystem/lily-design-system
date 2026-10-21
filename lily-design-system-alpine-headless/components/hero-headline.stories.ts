import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HeroHeadline component -->\n<!--\n  Description: a full-bleed hero section with headline overlaid on media\n  HTML tag: <div>\n  CSS class: hero-headline\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"hero-headline\"\n  aria-label=\"\"\n>\n  <div class=\"hero-headline-media\">\n    <!-- Consumer provides background media -->\n  </div>\n  <div class=\"hero-headline-content\">\n    <!-- Consumer provides headline content -->\n  </div>\n</div>";

const meta = {
  title: 'Headless/Hero Headline',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
