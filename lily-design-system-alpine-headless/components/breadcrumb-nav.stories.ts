import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- BreadcrumbNav component -->\n<!--\n  Description: a navigation container for breadcrumb trail links\n  HTML tag: <nav>\n  CSS class: breadcrumb-nav\n  Keyboard: None (passive element)\n  Accessibility: Implicit navigation role, aria-label for accessible name\n  Usage:\n    <nav class=\"breadcrumb-nav\" aria-label=\"Example\">\n      ...\n    </nav>\n-->\n\n<nav\n  class=\"breadcrumb-nav\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides navigation list -->\n</nav>";

const meta = {
  title: 'Headless/Breadcrumb Nav',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
