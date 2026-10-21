import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TagGroup component -->\n<!--\n  Description: a group of tag elements\n  HTML tag: <div>\n  CSS class: tag-group\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <div class=\"tag-group\" aria-label=\"Example\">\n      ...\n    </div>\n-->\n\n<div\n  class=\"tag-group\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides content -->\n</div>";

const meta = {
  title: 'Headless/Tag Group',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
