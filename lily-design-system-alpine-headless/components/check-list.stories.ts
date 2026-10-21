import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CheckList component -->\n<!--\n  Description: an ordered list of check list item components\n  HTML tag: <ol>\n  CSS class: check-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"check-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"check-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Check List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
