import type { Meta, StoryObj } from '@storybook/html-vite';

const html = "<!-- NavigationMenu component -->\n<!--\n  Description: a site-wide navigation menu with links\n  HTML tag: <nav>\n  CSS class: navigation-menu\n  Keyboard: None (passive element)\n  Accessibility: Implicit navigation role, aria-label for accessible name\n  Usage:\n    <nav class=\"navigation-menu\" aria-label=\"Example\">\n      ...\n    </nav>\n-->\n\n<nav\n  class=\"navigation-menu\"\n  aria-label=\"\"\n>\n  <!-- Consumer provides navigation list -->\n</nav>";

const meta = {
  title: 'Headless/Navigation Menu',
  render: () => html,
  tags: ['autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
