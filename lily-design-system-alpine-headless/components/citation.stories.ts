import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Citation component -->\n<!--\n  Description: a citation\n  HTML tag: <cite>\n  CSS class: citation\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<cite\n  class=\"citation\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</cite>";

const meta = {
  title: 'Headless/Citation',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
