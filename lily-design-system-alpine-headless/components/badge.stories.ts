import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- Badge component -->\n<!--\n  Description: a small label for counts, statuses, or categories\n  HTML tag: <span>\n  CSS class: badge\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <span class=\"badge\" aria-label=\"Example\">\n      ...\n    </span>\n-->\n\n<span\n  class=\"badge\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides text content -->\n</span>";

const meta = {
  title: 'Headless/Badge',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
