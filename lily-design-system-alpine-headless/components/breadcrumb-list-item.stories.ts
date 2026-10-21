import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BreadcrumbListItem component -->\n<!--\n  Description: one breadcrumb navigation link in the trail\n  HTML tag: <li> wrapped in <ol>\n  CSS class: breadcrumb-list-item\n  Accessibility: aria-label for accessible name\n-->\n\n<ol><li class=\"breadcrumb-list-item\" aria-label=\"Example\">\n    <!-- Consumer provides child content -->\n</li></ol>";

const meta = {
  title: 'Headless/Breadcrumb List Item',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
