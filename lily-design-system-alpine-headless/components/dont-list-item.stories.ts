import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- DontListItem component -->\n<!--\n  Description: a discouraged-practice item in a dont-list guideline list\n  HTML tag: <li> wrapped in <ol>\n  CSS class: dont-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"dont-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Dont List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
