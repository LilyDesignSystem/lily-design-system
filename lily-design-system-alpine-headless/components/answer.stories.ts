import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Answer component -->\n<!--\n  Description: an answer is anything that responds to a question, request, action, etc.\n  HTML tag: <div>\n  CSS class: answer\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n-->\n\n<div\n  class=\"answer\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Answer',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
