import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- CheckListItem component -->\n<!--\n  Description: one check list item component with a checkbox\n  HTML tag: <li> wrapped in <ol>\n  CSS class: check-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"check-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Check List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
