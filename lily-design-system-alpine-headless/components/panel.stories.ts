import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Panel component -->\n<!--\n  Description: a generic content panel with optional heading\n  HTML tag: <div>\n  CSS class: panel\n  Keyboard: None (passive element)\n  Accessibility: role=\"region\", aria-label for accessible name\n  Usage:\n    <div class=\"panel\" role=\"region\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"panel\"\n  role=\"region\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Panel',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
