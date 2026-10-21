import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BreadcrumbList component -->\n<!--\n  Description: an ordered list of breadcrumb navigation items\n  HTML tag: <ol>\n  CSS class: breadcrumb-list\n  Keyboard: None (passive element)\n  Accessibility: aria-label for accessible name\n  Usage:\n    <ol class=\"breadcrumb-list\" aria-label=\"Example\">\n      ...\n    </ol>\n-->\n\n<ol\n  class=\"breadcrumb-list\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides list items -->\n</ol>";

const meta = {
  title: 'Headless/Breadcrumb List',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
