import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TimelineList component -->\n<!--\n  Description: an ordered list of chronological events or milestones\n  HTML tag: <ol>\n  CSS class: timeline-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"timeline-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"timeline-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Timeline List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
