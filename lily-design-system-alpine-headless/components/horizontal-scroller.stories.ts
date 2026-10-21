import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- HorizontalScroller component -->\n<!--\n  Description: a horizontally scrollable content container\n  HTML tag: <div>\n  CSS class: horizontal-scroller\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name\n-->\n\n<div\n  class=\"horizontal-scroller\"\n  role=\"region\"\n  aria-label=\"\"\n  tabindex=\"0\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Horizontal Scroller',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
