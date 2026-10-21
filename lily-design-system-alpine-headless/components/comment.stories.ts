import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Comment component -->\n<!--\n  Description: a comment is anything that expresses an opinion, observation, explanation, etc.\n  HTML tag: <div>\n  CSS class: comment\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"comment\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Comment',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
