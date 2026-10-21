import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- ScrollerBase component -->\n<!--\n  Description: a low-level scroll position tracking primitive\n  HTML tag: <div>\n  CSS class: scroller-base\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"scroller-base\"\n  aria-label=\"\"\n  data-offset=\"0.5\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Scroller Base',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
