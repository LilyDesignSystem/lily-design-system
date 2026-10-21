import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DoListItem component -->\n<!--\n  Description: an encouraged-practice item in a do-list guideline list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: do-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"do-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Do List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
