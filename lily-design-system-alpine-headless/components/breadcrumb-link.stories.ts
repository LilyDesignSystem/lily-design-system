import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BreadcrumbLink component -->\n<!--\n  Description: one breadcrumb link in the trail\n  HTML tag: <a>\n  CSS class: breadcrumb-link\n  Keyboard: Tab to focus, Enter to follow link\n  Accessibility: aria-label for accessible name\n-->\n\n<a\n  class=\"breadcrumb-link\"\n  aria-label=\"\"\n  href=\"\"\n>\n  <!-- Consumer provides content -->\n</a>";

const meta = {
  title: 'Headless/Breadcrumb Link',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
