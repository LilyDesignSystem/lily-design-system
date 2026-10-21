import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- SummaryList component -->\n<!--\n  Description: an ordered list of key-value summary pairs\n  HTML tag: <ol>\n  CSS class: summary-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"summary-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"summary-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Summary List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
