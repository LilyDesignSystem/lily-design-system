import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Draft component -->\n<!--\n  Description: an early preliminary version of content such as an article, email, report, etc.\n  HTML tag: <div>\n  CSS class: draft\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Data attributes: data-status for consumer CSS/JS to observe draft status\n-->\n\n<div\n  class=\"draft\"\n  aria-label=\"\"\n  data-status=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Draft',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
