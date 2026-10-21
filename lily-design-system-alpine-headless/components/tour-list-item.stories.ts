import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- TourListItem component -->\n<!--\n  Description: one step in a tour guide list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: tour-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"tour-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Tour List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
